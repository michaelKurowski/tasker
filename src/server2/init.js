const createFiles = require('./utils/createFiles.js')


//Configs
const cfg = require('./config.json')
const routes = require('./routes.json')
const policies = require('./policies.json')
const models = require('./models.json')
const dbFieldTypes = require('./dbFieldTypes.json')

const MongoClient = require('mongodb').MongoClient
const sessionRegister = require('./sessionRegister.js')
const assert = require('assert')
const express = require('express')
const bodyParser = require('body-parser')
const requestVerifier = require('./requestVerifier.js')
const chalk = require('chalk')
const log = console.log

let httpServer = express()
/*
Each global variable below this line is a promise
At the very bottom of the file Promise.all() is being exported which waits
until all these promises will be fullfiled.
*/
let dbConnection = new Promise( (resolve, reject) => {
	log('Connecting to MongoDB server...')
	MongoClient.connect(cfg.mongoDbUrl, (err, db) => {
		if (err != null) return reject(err)
		log(`Connected correctly to MongoDB server: ${cfg.mongoDbUrl}`)
		resolve(db)
	})
})
dbConnection.catch(err => log(chalk.red('[init.js] Connecting to MongoDB server unsuccessful.', err)))


let httpServerCreation = new Promise( (resolve, reject) => {
	//TODO reject
	if (!Number.isInteger(cfg.httpPort) &&
				cfg.httpPort < 65535 &&
			 		cfg.httpPort > 0) return reject('Port defined in config.json is not valid.')
	httpServer.listen(cfg.httpPort, err => {
		log(`HTTP server listenin on port ${cfg.httpPort}`)
		resolve(httpServer)
	})
})
httpServerCreation.catch( err => log(chalk.red('[init.js] Creation of http server unsuccessful.', err)))
/* TODO initializing models
let initiatingModels = dbConnection.then( db => {

	let spawnFiles = createFiles(
		dbFieldTypes,
		'./dbFieldTypes',
		'name',
		`module.exports = {
			validation(value) {
				return true
			},
			preparation(value) {
				return value
			}
		}`
	)
	return spawnFiles.then( () => {
		//
		//////////////COMPARING MODELS TO COLLECTIONS//////////////

		//Creating lists of models and collections
		let modelsList = models.map((model, index) => {
			return {name: model.name, id: index}
		})
		let collections = []
		let listingCollections = new Promise( (resolve, reject) => {
			 db.listCollections().each((err, collection) => {
				if (err) return reject()
				if (collection === null) return resolve()
				collections.push(collection)
			})
		})
		listingCollections.catch( err => log(chalk.red(`[init.js] Error during listing collections that match to models ${err}`)))

		listingCollections.then( () => {

			modelsList.map( model => {
				let matchedCollection = collections.find(coll => coll.name === model.name)
				if (matchedCollection !== undefined) {
					log(matchedCollection.options.validator.$or)
					//Creating validator based on model
					let matchedCollectionValidator = matchedCollection.options.validator.$and
					let modelValidator = {
						$and: []
					}
					//creating validator
					modelValidator.$and = model.fields.map( field => {
						let fieldValidator = {}

					})
					/*
					let modelValidator = {
						$and: model.
					}

					assert.deepEqual(
						matchedCollection.options.validator,
						expected,
						[message]
					)
					*/
				} else {
					log(`[init.js] No '${model.name}' collection found. Creating...`)
				}
			})
		})


		/*
		db.listCollections().forEach(
			el => log(el)
		)
		*/
		//Initiating db
		/*
		return Promise.all([
			db.createCollection('users', {
				validator: {
					$or: [
						{ username: { $exists: false } },
						{ email: { $regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ } }
					]
				}
			}),
			db.createCollection('tasks', {
				validator: {
					$or: [
						{ title: { $type: 'string' } }
					]
				}
			}),
			db.createCollection('historyLogs', {
				validator: {
					$or: [
						{ title: { $type: 'string' } }
					]
				}
			})
		])
		*/
	})
	return Promise.resolve()
	spawnFiles.catch(err => log(chalk.red(`[init.js] Neccessary files creation failed ${err}`)))
})
*/
/*
Loads controllers and policies
Creates routes
*/
let creatingRoutes = httpServerCreation.then( httpServer => {
	//Ensuring that controller and policies files exist
	let spawnFiles = Promise.all([
		createFiles(
			routes,
			'./controllers',
			'controller',
			`module.exports = (req, res) => res.send('ThisIsATest')`
		),
		createFiles(
			policies,
			'./policies',
			'fileName',
			`module.exports = (req, res, next) => next()`
		)
	])
	spawnFiles.catch(err => log(chalk.red(`[init.js] Neccessary files creation failed ${err}`)))
	return spawnFiles.then( () => {
		log('All files created')
		routes.forEach( route => {
			let matchedPolicy = policies.find(policy => policy.name === route.policy)
			if (!matchedPolicy) Promise.reject(`[init.js] Policy '${route.policy}' assigned to '${route.path}' route, not found.`)
			return httpServer[route.requestType](route.path,
				//Middleware routing
				requestVerifier,
				bodyParser.json(),
				sessionRegister,
				require(`./policies/${matchedPolicy.fileName}.js`),
				require(`./controllers/${route.controller}.js`)
			)
		})
		return Promise.resolve()
	})


})

/*
Passes promises of each of enlisted actions.
index.js will wait for them to be fullfiled.
*/
module.exports = Promise.all([dbConnection, httpServerCreation, creatingRoutes])
