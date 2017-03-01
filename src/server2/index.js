'use strict'
const cfg = require('./config.json')
const chalk = require('chalk')
const log = console.log
let httpServer = require('./routes.js')

let init = require('./init.js')
init.then( values => {
	log( chalk.white('Initialization completed') )
	httpServer.listen(cfg.httpPort, () => {
		log( chalk.green(`HTTP server listenin on port ${cfg.httpPort}`) )
	})
	}
).catch( err => {
	log(chalk.red('init.js unsuccessful.', err))
})

init.catch( err => {
	log(chalk.red('init.js unsuccessful.', err))
})
//Listeners
