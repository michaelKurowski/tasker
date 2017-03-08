const createFiles = require('./utils/createFiles.js')
const cfg = require('./config.json')
const routes = require('./routes.json')
const policies = require('./policies.json')
const MongoClient = require('mongodb').MongoClient

const assert = require('assert')
const express = require('express')

const chalk = require('chalk')
const log = console.log

let httpServer = express()

let dbConnection = new Promise( (resolve, reject) => {
	log('Connecting to MongoDB server...')
	MongoClient.connect(cfg.mongoDbUrl, (err, db) => {
		//TODO reject
		assert.equal(null, err)
		log(`Connected correctly to MongoDB server: ${cfg.mongoDbUrl}`)
		resolve(db)
	})
})



let httpServerCreation = new Promise( (resolve, reject) => {
	//TODO reject
	httpServer.listen(cfg.httpPort, () => {
		log(`HTTP server listenin on port ${cfg.httpPort}`)
		resolve(httpServer)
	})
})
httpServerCreation.catch( err =>
	log(chalk.red('[init.js] Creation of http server unsuccessful.', err))
)

/*
Assigns routes from ./routes.json to express http Server and
assigns controllers to them.
TODO sessions
*/
let creatingRoutes = httpServerCreation.then( httpServer => {
	//Creating controller files
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
		routes.map( route => {
			let matchedPolicy = policies.find(policy => policy.name === route.policy)
			if (!matchedPolicy) Promise.reject(`[init.js] Policy '${route.policy}' assigned to '${route.path}' route, not found.`)
			return httpServer.get(route.path,
				//Middleware routing
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
