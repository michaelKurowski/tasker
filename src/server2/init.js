const createFiles = require('./utils/createFiles.js')
const clnAssert = require('./utils/cleanAssert.js')

//Configs
const cfg = require('./config.json')
const routes = require('./routes.json')
const policies = require('./policies.json')
const models = require('./models.json')

const MongoClient = require('mongodb').MongoClient
const sessionRegister = require('./sessionRegister.js')
const express = require('express')
const bodyParser = require('body-parser')
const requestVerifier = require('./requestVerifier.js')
const chalk = require('chalk')
const readline = require('readline')
const prompt = require('prompt-sync')()
const log = console.log


const readln = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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

/*
	INITIATING MODELS
	Creating models files -> Creating lacking collections for models ->
	checking if existing collections are consistent with models ->
	solving eventual inconsistency.
*/

let initiatingModels = dbConnection.then( db => {

	let spawnFiles =
		createFiles(
			models,
			'./models',
			'name',
			`module.exports = {prepare: () => {}}`
		)
	spawnFiles.catch(err => log(chalk.red(`[init.js] Neccessary files creation failed ${err}`)))

	//Enlisting existing collections
	let enlistCollections = spawnFiles.then( () => new Promise ( (resolve, reject) => {
			let collections = []
			db.listCollections().each( (err, collection) => {
				if (err) {
					log(chalk.red('[init.js] initiation of models: failed to enlist collections.'))
					reject(err)
				}
				if (collection === null) {
					resolve(collections)
				} else {

					collections.push(collection)

				}
			})
		})
	)
	//TODO refactor
	enlistCollections.catch(err => log(chalk.red(`[init.js] Collection enlisting failed ${err}`)))

	//Comparing existing collections to models
	let findingIncorrectCollections = enlistCollections.then( collections => new Promise ( (resolve, reject) => {
		//Iterate through each model and find fitting collection by name
		let incompatiblePairs = []
		let creatingCollections = []
			models.forEach( model => {
				let collectionExists = false
				collections.forEach( collection => {
					//console.log(model.name, collection.name)
					if (model.name === collection.name) {
						//Compare validators
						collectionExists = true
						log(`[init.js] "${model.name}" collection exists. Checking correctness...`)
						if (!clnAssert.deepEqual(model.validator, collection.options.validator)) {
							//console.log('incompatible')
							incompatiblePairs.push({model, collection})
						}
					}
				})
				if (!collectionExists) {
					log(`[init.js] "${model.name}" collection doesn't exists. Creating...`)
					creatingCollections.push( new Promise ((resolve, reject) =>
						db.createCollection(
							model.name,
							{validator: model.validator},
							err => {
								if (err) {
									reject(err)
								} else {
									log(`[init.js] "${model.name}" collection created...`)
									resolve()
								}

							}
						)
					))
				}
			})
			if (creatingCollections.length === 0 ) return resolve(incompatiblePairs)
			return Promise.all(creatingCollections)
		})
	)
	findingIncorrectCollections.catch(err => log(chalk.red(`[init.js] Incorrect collections enlisting failed ${err}`)))

	//Fixing mismatches between models and collections
	return findingIncorrectCollections.then( incompatiblePairs => new Promise( (resolve, reject) => {

			if (incompatiblePairs.length === 0) return resolve()
			let fixingMismatches = []
			let resolvingFixingMismatches = []

			for (let i = 0; i < incompatiblePairs.length; i++) {
				fixingMismatches.push(new Promise( (resolve, reject) => resolvingFixingMismatches.push({resolve, reject}) ))
			}
			log(fixingMismatches)
			incompatiblePairs.forEach( (pair, index) => {
				//TODO fix prompt issue
				let userDecission = prompt(`"${pair.model.name}" validator mismatch between model and collection. Do you want to:\n 1) Drop current collection and create new.\n 2) Migrate to new collection. - WIP.\n 3) Abort - WIP\n\n `)
				log(`You've choosed ${userDecission}.\n`)
				switch (userDecission) {
					case '1':
						let dropCollection = new Promise( (resolve, reject) =>
							db.collection(pair.model.name).drop(() => {
								console.log(`"${pair.model.name}" collection dropped`)
								return resolve()
							})
						)
						//dropCollection.catch(chalk.red(`[init.js] Failed to drop "${pair.model.name}" collection.\n${err}`))
						return dropCollection.then( () => new Promise ((resolve, reject) =>
							db.createCollection(
								pair.model.name,
								{validator: pair.model.validator},
								err => {
									if (err) return resolvingFixingMismatches[index].reject(err)
									console.log(`"${pair.model.name}" collection recreated`)
									resolvingFixingMismatches[index].resolve()
								}
							)
						))
						break
					case '2':

						let createCollection = new Promise ( (resolve, reject) => {
							db.createCollection(
								pair.model.name + '_clone',
								{validator: pair.model.validator},
								err => {
									if (err) return reject(err)
									log(`Collection "${pair.model.name}" has been cloned.`)
									resolve()
								}
							)
						})
						createCollection.catch( err => log(chalk.red(`[init.js] Failed to create "${pair.model.name}_clone" collection.\n${err}`)))
						let cloningDocuments = createCollection.then( () => new Promise ((resolve, reject) => {
							//TODO
							let loadingDocuments = new Promise ( (resolve, reject) => {
								let convertingToArray = db.collection(pair.model.name).find().toArray()
								convertingToArray.then( documents => resolve(documents))
								convertingToArray.catch( err => {
									db.collection(pair.model.name + '_clone').drop()
									reject(err)
								})
							})
							loadingDocuments.catch(err => log(chalk.red(`[init.js] Failed to load "${pair.model.name}" collection documents.\n${err}`)))
							loadingDocuments.then( documents => {
								db.collection(pair.model.name + '_clone').insertMany(documents)
							})


						}))


						break
					case '3':
						//TODO finish
						log(chalk.red(`[init.js] A server has been stopped by user`))
						Promise.reject(`[init.js] A server has been stopped by user`)
						break
					default:

				}
			})

		})
	)

	return Promise.resolve()
})

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
module.exports = Promise.all([dbConnection, httpServerCreation, creatingRoutes, initiatingModels])
