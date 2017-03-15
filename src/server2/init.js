const createFiles = require('./utils/createFiles.js')


//Configs
const cfg = require('./config.json')
const routes = require('./routes.json')
const policies = require('./policies.json')
const models = require('./models.json')

const MongoClient = require('mongodb').MongoClient
const sessionRegister = require('./sessionRegister.js')
const assert = require('assert')
const express = require('express')
const bodyParser = require('body-parser')
const requestVerifier = require('./requestVerifier.js')
const chalk = require('chalk')
const readline = require('readline')
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

let initiatingModels = dbConnection.then( db => {
/*
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
					console.log(chalk.red('[init.js] initiation of models: failed to enlist collections.'))
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

	enlistCollections.catch(err => log(chalk.red(`[init.js] Collection enlisting failed ${err}`)))
	//Comparing existing collections to models
	enlistCollections.then( collections => new Promise ( (resolve, reject) =>
		//Iterate through each model and find fitting collection by name
		models.forEach( model => {
			collections.forEach( collection => {
				if (model.name === collection.name) {
					//Compare validators
					try {
						assert.deepEqual(model.validator, collection.options.validator)
					} catch (assertionError) {
						console.log(chalk.red(`[init.js] Model and collection validators of "${model.name}" are not the same`))
						console.log(chalk.red(`Drop existing collection or change validator\n\n\n`))
						let actionQuestion = () => readln.question('Do you want to: 1) Drop the collection and create from scratch. 2) Change collection\'s validator. 3) Abort',
							answer => {
								switch (answer) {
									case '1':

									case '2':

									case '3':
										reject('[init.js] Server startup aborted by user')
										break
									default:
										actionQuestion()
										return true
								}
								readln.close()
							}
						)
						actionQuestion()
					}
				}
			})
		})
	))
	*/
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
