'use strict'
const cfg = require('./config.json')
const chalk = require('chalk')
const log = console.log

let init = require('./init.js')
init.then( values => {
	log(values[0])
	log( chalk.white('Initialization completed') )

	}
)
init.catch( err => {
	log(chalk.red('[index.js] Server initialization unsuccessful.', err))
})
