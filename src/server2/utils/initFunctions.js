const createFiles = require('./createFiles.js')
const fs = require('fs')
const bodyParser = require('body-parser')
const clnAssert = require('../utils/cleanAssert.js')
const log = console.log
module.exports = {
	initRoutes(httpServer, routes, policies, requestVerifier, sessionRegister) {
		//Ensuring that controller and policies files exist
		return new Promise( (resolve, reject) => {
			routes.forEach( route => {
				let matchedPolicy = policies.find(policy => policy.name === route.policy)
				if (!matchedPolicy) reject(`[init.js] Policy '${route.policy}' assigned to '${route.path}' route, not found.`)
				return httpServer[route.requestType](route.path,
					//Middleware routing
					requestVerifier,
					bodyParser.json(),
					sessionRegister,
					require(`../policies/${matchedPolicy.fileName}.js`),
					require(`../controllers/${route.controller}.js`)
				)
			})
			return resolve()
		})


	},
	spawnRoutingFiles(routes, policies) {
		return Promise.all([
			createFiles(
				routes,
				'./controllers',
				'controller',
				fs.readFileSync('./templates/controller.js')
			),
			createFiles(
				routes,
				'./test/controllers',
				'controller',
				fs.readFileSync('./templates/controllerTest.js')
			),
			createFiles(
				policies,
				'./policies',
				'fileName',
				fs.readFileSync('./templates/policy.js')
			)
		])
	},
	mongo: {
		enlistCollections(mongodb) {
			return new Promise ( (resolve, reject) => {
				let collections = []
				mongodb.listCollections().each( (err, collection) => {
					if (err) return reject(err)
					if (collection === null) {
						resolve(collections)
					} else {
						collections.push(collection)
					}
				})
			})
		},
		findIncorrectCollections(collections, models, logToConsole = true) {
			return new Promise ( (resolve, reject) => {
				//Iterate through each model and find fitting collection by name
				let incompatiblePairs = []
				let creatingCollections = []
				models.forEach( model => {
					let collectionExists = false
					collections.forEach( collection => {
						if (model.name === collection.name) {
							//Compare validators
							collectionExists = true
							if (logToConsole)
								log(`[init.js] "${model.name}" collection exists. Checking correctness...`)
							if (!clnAssert.deepEqual(model.validator, collection.options.validator)) {
								incompatiblePairs.push({model, collection})
							}
						}
					})
					if (!collectionExists) {
						if (logToConsole)
							log(`[init.js] "${model.name}" collection doesn't exists. Creating...`)
						creatingCollections.push( new Promise ((resolve, reject) =>
							db.createCollection(
								model.name,
								{validator: model.validator},
								err => {
									if (err) return reject(err)
									if (logToConsole)
										log(`[init.js] "${model.name}" collection created...`)
									resolve()
								}
							)
						))
					}
				})
				if (creatingCollections.length === 0 ) return resolve(incompatiblePairs)
				return Promise.all(creatingCollections)
			})
		}
	}
}
