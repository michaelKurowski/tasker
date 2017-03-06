const fs = require('fs')
const createFilesFromConfig = require('./utils/createFiles.js')
const cfg = require('./config.json')
const routes = require('./routes.json')

const MongoClient = require('mongodb').MongoClient

const assert = require('assert')
const express = require('express')

const chalk = require('chalk')
const log = console.log

let httpServer = express()

let dbConnection = new Promise( (resolve, reject) => {
	console.log('Connecting to MongoDB server...')
	MongoClient.connect(cfg.mongoDbUrl, (err, db) => {
		assert.equal(null, err)
		console.log(`Connected correctly to MongoDB server: ${cfg.mongoDbUrl}`)
		resolve(db)
	})
})



let httpServerCreation = new Promise( (resolve, reject) => {
	httpServer.listen(cfg.httpPort, () => {
		console.log(`HTTP server listenin on port ${cfg.httpPort}`)
		resolve(httpServer)
	})
})
httpServerCreation.catch( err =>
	log(chalk.red('[init.js] Creation of http server unsuccessful.', err))
)

/*
Assigns routes from ./routes.json to express http Server and
assigns controllers to them.
TODO Middleware (policies)
*/
let assigningRoutes = httpServerCreation.then( httpServer => {
	//Creating controller files
	let spawnControllers = createFilesFromConfig(
		routes,
		'./controllers/',
		'controller',
		`module.exports = (req, res) => res.send('ThisIsATest')`
	)
	return spawnControllers.then( () => {
		log('All controllers exist')
		return new Promise( (resolve, reject) => {
			routes.forEach( element => {
				return httpServer.get(
					element.route,
					require(`./controllers/${element.controller}.js`),
					err => {
						log(chalk.red(err))
						reject(err)
					}
				)
			})
			resolve()
		})
	})
	spawnControllers.catch(err => log(chalk.red(`[init.js] Lacking controllers creation failed ${err}`)))
})

/*
Passes promises of each of enlisted actions.
index.js will wait for them to be fullfiled.
*/
module.exports = Promise.all([dbConnection, httpServerCreation, assigningRoutes])
