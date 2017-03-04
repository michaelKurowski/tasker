const fs = require('fs')

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
TODO Refactor this, or/and create from it separated function to spawn
lacking files
*/
let assigningRoutes = httpServerCreation.then( httpServer => {
	//Creating controller files
	let filesSpawningPromises = []
	routes.forEach( (element, index) => {
		let ctrlPath = `./controllers/${element.controller}.js`
		if ( !fs.existsSync(ctrlPath) ) {
			let checkController = new Promise( (resolve, reject) => {
				fs.writeFile(
					ctrlPath,
					`module.exports = (req, res) => res.send('${element.controller}')`,
					err => {
						if (err) {
							reject(err)
							log(chalk.red(err))
						} else {
							log('Created file: ', ctrlPath)
							resolve()
						}
					}
				)
			})
			filesSpawningPromises.push(checkController)
		}
	})
	if (filesSpawningPromises.length === 0) {
		//If there is no promises, then spawn immidiatelly resolving promises
		//in order to resolve Promise.all
		filesSpawningPromises.push(new Promise((resolve, rejetc) => {resolve()}))
	}
	return Promise.all(filesSpawningPromises).then( () => {
		log('All controllers exist')
		return new Promise( (resolve, reject) => {
			routes.forEach( element => {
				//I'm not sure if this action is synchrous.
				//I might need to create promise for it
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
})

/*
Passes promises of each of enlisted actions.
index.js will wait for them to be fullfiled.
*/
module.exports = Promise.all([dbConnection, httpServerCreation, assigningRoutes])
