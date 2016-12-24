'use strict'
const cfg = require('./config.json')
const bcrypt = require('bcrypt')
module.exports = {
	sessions: [],
	salt: bcrypt.genSaltSync(10),
	spawnSession(username, password, id) {
		const token = bcrypt.hashSync(username + password + new Date().getTime(), this.salt)
		this.sessions[token] =  {
			id,
			expirationDate: new Date().getTime() + cfg.sessionsExpiration
		}
		const session = this.sessions[token]
		console.log('Afdter creation ', session)
		return token
	},
	getIdFromSession(token) {
		const session = this.sessions[token]
		console.log('whole list ', this.sessions)
		console.log('getting results ',token, 'results:', session)
		if (session && session.expirationDate > new Date().getTime()) {
			return token
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
	}
}
