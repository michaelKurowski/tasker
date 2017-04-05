"use strict"
const cfg = require('./config.json')
const taskerVersion = require('./package.json').version
const $T = Object.assign( {},
	require('./init.js'),
	require('./controllers.js')
)
const $sM = require('./sessions.js')
const instanceType = (cfg.devInstance) ? 'developerInstance' : 'productionInstance'
//const bcrypt = require('bcrypt')


$T.connectToDb(cfg.mongoDbUrl).then( dbConnectionObject => {
	$T.startHttpServer(
		cfg.httpListeningPort,
		(req, res) => handleRequest(req, res, dbConnectionObject)
	).then( httpServer => {
		console.log(`Tasker ${taskerVersion} server is running.`)
		//console.log(`MongoDB Object:`, dbConnectionObject.collection('test', function(err, collection) {}))
	})
})


function handleRequest(req, res, db){
	//Extracts slice of path after '/' in request url
	const requestAction = req.url.slice(1)
	let body = []
	//Sets response header according to config.json
	cfg.httpServerResponsesHeader[instanceType].forEach(
		record => res.setHeader(record.header, record.value)
	)
	//Gathering body from request
	//console.log(':::::::::::::::::::::::::::::::::::::::::::::::', req)
	req.on(
		'error',
		err => {
			console.log('Ann error occured during receiving request body:', err)
			res.end('Undefined action')
		}
	).on(
		'data',
		chunk => body.push(chunk)
	).on(
		'end',
		() => {
			//Redirects to a proper controller
			body = Buffer.concat(body).toString()
			console.log('/' + requestAction)
			console.log('Received body: ', body)
			let parsedBody = ''
			try {
				parsedBody = JSON.parse(body)
			} catch(err) {
				console.log('An error occured during parsing received body:', body, err)
			}
			if ($T.controllers[requestAction]) {
				$T.controllers[requestAction](req, res, db, parsedBody, $sM)
			} else {
				res.end('Undefined action')
			}
		}
	)

}
