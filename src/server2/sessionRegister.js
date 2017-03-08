/*
This file is a first stage of processing incomming request
It handles sessions.
*/
let sessions = require('./sessionsManager.js')

module.exports = (req, res, next) => {
	next()
}
