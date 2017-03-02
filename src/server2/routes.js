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


httpServer.post('/task/remove', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/task/edit', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/task/create', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})

httpServer.post('/user/create', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/user/edit', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})
httpServer.post('/user/remove', function (req, res) {
	//Sending tasker files
	res.send('Hello World!')
})


module.exports = httpServer
