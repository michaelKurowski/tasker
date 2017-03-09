/*
This file is a first stage of processing incomming request
It handles sessions.
*/
let sessions = require('./sessionsManager.js')

//res.body contains parsed JSON
module.exports = (req, res, next) => {
	//TODO sessions and token handling
	if (req.body.token) {
		req.session = sessions.get(token)
		if (req.session) {
			res.send(
				
			)
		}
	}
	next()
}
