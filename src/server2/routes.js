const express = require('express')
const bodyParser = require('body-parser')
let httpServer = express()


httpServer.post('/', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/login', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/signUp', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/load', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/create/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/remove/task', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})

module.exports = httpServer
