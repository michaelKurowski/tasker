'use strict'
const cfg = require('./config.json')
const bcrypt = require('bcrypt')
module.exports = {
	sessions: {},
	salt: bcrypt.genSaltSync(10),
	spawnSession(username, password, id) {
		const token = bcrypt.hashSync(username + password + new Date().getTime(), this.salt)
		this.sessions[token] =  {
			id,
			expirationDate: new Date().getTime() + cfg.sessionsExpiration,
			username
		}
		const session = this.sessions[token]
		console.log('Afdter creation ', session)
		return token
	},
	sessionStillExists(sessionObject){
		if (sessionObject && sessionObject.expirationDate > new Date().getTime()) {
			return true
		}
		delete this.sessions[token]
		return false
	},
	getIdFromSession(token) { //archaic function, will be replaced in code
		const session = this.sessions[token]
		console.log('sessions.getIdFromSession(token): whole list ', this.sessions)
		console.log('sessions.getIdFromSession(token): getting results ',token, 'results:', session)
		if (session && session.expirationDate > new Date().getTime()) {
			return token
		}
		delete this.sessions[token]
		return false
	},
	getSessionFromToken(token) {
		const session = this.sessions[token]
		return this.sessionStillExists(session) ? session : false
	},
	getUsernameFromSession(token) {
		const session = this.sessions[token]
		console.log('sessions.getIdFromSession(token): whole list ', this.sessions)
		console.log('sessions.getIdFromSession(token): getting results ',token, 'results:', session)
		if (session && session.expirationDate > new Date().getTime()) {
			return session.username
		}
		delete this.sessions[token]
		return false
	},
	prolongSession(token) {
		let session = this.sessions[token]
		if (session && session.expirationDate > new Date().getTime()) {
			session.expirationDate = new Date().getTime() + cfg.sessionsExpiration
			this.sessions[token] =  session
			return true
		}
		delete this.sessions[token]
		return false
	},
	deleteSession(token) {
		delete this.sessions[token]
		return true
	},
	authenticate(res, token) {
		const session = sessionsManagement.getIdFromSession(data.token)
		if (!session) {
			res.statusCode = 200
			res.end('{}')
			return false
		}
	}
}
