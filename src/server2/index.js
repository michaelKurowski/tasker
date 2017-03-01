'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cfg = require('./config.json')
const log = require('chalk')

let app = express()
app.post('/', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.post('/login', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.post('/signUp', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.post('/load', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.post('/create/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.post('/remove/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})

require('./init.js').then( values =>
	app.listen(cfg.httpPort, function () {

	})
).catch( err => {
	log.red('init.js unsuccessful.')
})
//Listeners
