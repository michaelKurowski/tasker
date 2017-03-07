'use strict'
const cfg = require('./config.json')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectID
const log = console.log
const chalk = require('chalk')
//TODO completly rewrite this madness
/*
	Plan of new sessions.js exported object
	createSession(string username, string password, int userId) -> promise with session
	getSessionByToken(token) -> session
	stillExists(token) -> bool
	prolongSession(token) -> bool
	deleteSession(token) -> bool
	authenticate(token) -> bool - checks if session exists

	session Obj
	{username, userId, creationDate, expirationDate}
*/
module.exports = {
	activeSessions: new Map(),
	salt: bcrypt.genSaltSync(cfg.saltStrength),
	createSession(username, userId) {
		return new Promise( (resolve, reject) => {
			const token = bcrypt.hash(
				new ObjectId().str,
				this.salt,
				null,
				(err, hash) => {
					if (err) {
						log(chalk.red(`[sessions.js] An error during creating a session ${err}`))
						return reject(err)
					}
					this.activeSessions.set(
						hash,
						{
							username,
							userId,
							creationDate: new Date().getTime(),
							expirationDate: new Date().getTime() + cfg.sessionsExpiration
						}
					)
					return resolve(hash)
				})
			}
		)
	},
	get(token) {
		if (this.stillExists(token)) return this.activeSessions.get(token)
		return false
	},
	stillExists(token) {
		const session = this.activeSessions.get(token)
		if (session.expirationDate < new Date.getTime()) {
			this.activeSessions.delete(token)
			return false
		}
		return true
	},
	prolongSession(token) {
		let session = this.activeSessions.get(token)
		if (session) {
			session.expirationDate = new Date().getTime() + cfg.sessionsExpiration
			this.activeSessions.set(token, session)
			return true
		}
		return false
	},
	deleteSession(token) {
		if (stillExists(token)) {
			this.activeSessions.delete(token)
			return true
		}
		return false
	},
	authenticate(username, token) {
		const session = this.getSessionByToken(token)
		if (session && session.username === username) return true
		return false
	}
}

/*
module.exports = {
	sessions: {},
	salt: bcrypt.genSaltSync(10),
	spawnSession(username, password, id) {
		//TODO make it async
		const token = bcrypt.hashSync(username + password + new Date().getTime(), this.salt)
		this.sessions[token] =  {
			id,
			expirationDate: new Date().getTime() + cfg.sessionsExpiration,
			username
		}
		const session = this.sessions[token]
		console.log('After creation ', session)
		return token
	},
	sessionStillExists(sessionObject){
		if (sessionObject && sessionObject.expirationDate > new Date().getTime()) {
			return true
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
*/
