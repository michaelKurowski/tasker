'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cfg = require('./config.json')

let app = express()

//Listeners
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
app.listen(cfg.httpPort, function () {

})
