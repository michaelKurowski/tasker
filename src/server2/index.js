'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cfg = require('./config.json')

let app = express()

//Listeners
app.get('/', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.get('/login', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.get('/signUp', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.get('/load', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.get('/create/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.get('/remove/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
app.listen(cfg.httpPort, function () {

})
