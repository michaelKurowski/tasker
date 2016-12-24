'use strict'
const cfg = require('./config.json')
const bcrypt = require('bcrypt')
module.exports = {
	sessions: new WeakMap(),
	salt: bcrypt.genSaltSync(10),
	spawnSession(username, password, id) {
		const token = bcrypt.hashSync(username + password + new Date().getTime(), this.salt)
		this.sessions.set({token}, {
			id,
			expirationDate: new Date().getTime() + cfg.sessionsExpiration
		})
		return token
	},
	getIdFromSession(token) {
		const session = this.sessions.get({token})
		if (session && session.expirationDate > new Date().getTime()) {
			return token
		}
		this.sessions.delete({token})
		return false
	},
	prolongSession(token) {
		let session = this.sessions.get({token})
		if (session && session.expirationDate > new Date().getTime()) {
			session.expirationDate = new Date().getTime() + cfg.sessionsExpiration
			this.sessions.set({token}, session)
			return true
		}
		this.sessions.delete({token})
		return false
	},
	deleteSession(token) {
		this.sessions.delete({token})
		return true
	}
}
