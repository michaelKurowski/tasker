'use strict'
const chalk = require('chalk')
const log = console.log

let init = require('./init.js')
init.then( values => {
	//let db = values[0]
	log( chalk.green('Initialization completed. Tasker server is running') )
})
init.catch( err => {
	log(chalk.red('[index.js] Tasker server initialization unsuccessful.', err))
})
