'use strict'
let ObjectID = require('mongodb').ObjectID
module.exports = {
	controllers: {
		login(req, res, db, data, sessionsManagement) {
			if (sessionsManagement.getSessionFromToken(data.token)) {
				res.statusCode = 204
				return res.end('Already logged in')
			}
			if (data.username && data.password) {
				const queryPromise = new Promise( (resolve, reject) => {
					db.collection('users').find({
							username: data.username,
							password: data.password
						},
						{_id: 1},
						(err, result) => {
							//console.log(result)
							return err ? reject(err) : resolve(result)
						}
					)
				})
				queryPromise.catch( findErr => {
					res.end(  JSON.stringify(insertErr)  )
				})
				queryPromise.then(findResults => {
					findResults.toArray( (err, result) => {
						if (result.length !== 0) {
							//console.log(`${data.username} logged in using ${data.password}.`)
							const token = sessionsManagement.spawnSession(data.username, data.password, result[0]._id)
							res.end(  JSON.stringify({token}))
							console.log('/login ',data.username, ' logged in')
						} else {
							//console.log(`${data.username} tried to log in using ${data.password}.`)
							res.statusCode = 401
							res.end(JSON.stringify({}))
						}
					})
				})
			} else {
				res.end('No data')
			}
		},
		signUp(req, res, db, data) {
			console.log('signUp data', data)
			//console.log('single data', data)
			if (data.username && data.password && data.email) {
				const query = db.collection('users').insert({
						username: data.username,
						password: data.password,
						email: data.email
					},
					{w: 1}
				)
				query.catch( insertErr => {

					res.end(  JSON.stringify(insertErr)  )
				})
				query.then( insertResults => {
					res.end(`User ${data.username} inserted`)
					console.log(`User ${data.username} inserted`)
				})
			} else {
				res.end('No data')
			}
		},
		logout(req, res, db, data, $sM) {
			$sM.deleteSession(data.token)
			res.end('Logout')
		},
		save(req, res, db, data, sessionsManagement) {
			const session = sessionsManagement.getSessionFromToken(data.token)
			//console.log('data: ', data.tasks, data.username)

			if (!session) {
				//res.statusCode = 401
				res.end('{}')
				return false
			}
			if (data.tasks && data.username) {
				const query = db.collection('users').update(
					{username: data.username},
					{$set: {tasks: data.tasks}}
				)
				query.catch( insertErr => {
					console.log('err:', insertErr)
					res.statusCode = 412
					res.end(  JSON.stringify(insertErr)  )
				})
				query.then( insertResults => {
					res.end(`{}`)
					console.log(`User ${data.username} updated`)
				})
			}
			res.statusCode = 412
			res.end('{}')
		},
		load(req, res, db, data, sessionsManagement) {
			console.log('login: data received:', data)
			const session = sessionsManagement.getSessionFromToken(data.token)
			console.log('controller load: session', session)
			if (!session) {
				console.log('controller load: login: NOT LOGGED IN', session)
				//console.log(session)
				//TODO manage to set status code to 401 without breaking up a whole app
				res.statusCode = 200
				res.end('{}')
				return false
			}
			if (session) {
				let tasksMap = []
				const queryPromise = new Promise( (resolve, reject) => {
					db.collection('tasks').find({
						ownerId: session.id
					}).then( results => {
						return Promise( (resolve, reject) => {
							console.log('queryPromise ',results.toArray())
						})
					})
				})

				queryPromise.catch( findErr => {
					res.end(  JSON.stringify(insertErr)  )
				})
				queryPromise.then(findResults => {
					findResults.toArray( (err, result) => {
						console.log(`${JSON.stringify(data)} ${data.username} returned tasks.`, result)
						//console.log(result)
						res.end(  JSON.stringify(result[0].tasks)  )
					})
				})
			} else {
				res.end('No data')
			}
			//res.end('Load')
		},
		createTask(req, res, db, data, sessionsManagement) {
			const session = sessionsManagement.getSessionFromToken(data.token)
			sessionsManagement.authenticate(res, session)
			if (data.title && data.deadline) {
				const query = db.collection('tasks').insert({
						ownerId: new ObjectID(session.id),
						name: data.title,
						deadline: data.deadline,
						creationDate: new Date(),
					},
					{w: 1}
				)
				query.catch( insertErr => {
					res.end(  JSON.stringify(insertErr)  )
				})
				query.then( insertResults => {
					res.end(`Task ${data.title} inserted`)
					console.log(`Task ${data.title} inserted`)
				})
			} else {
				res.end('No data')
			}
		},
		editTask(req, res, db, data, sessionsManagement) {

		},
		removeTask(req, res, db, data, sessionsManagement) {

		},
		addLog(req, res, db, data, sessionsManagement) {

		},
		editLog(req, res, db, data, sessionsManagement) {

		},
		removeLog(req, res, db, data, sessionsManagement) {

		},
		initDb(req, res, db) {
			console.log('initiating database\n')
			Promise.all([
				db.createCollection('users', {
					validator: {
						$or: [
							{ username: { $exists: false } },
							{ email: { $regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ } }
						]
					}
				}),
				db.createCollection('tasks', {
					validator: {
						$or: [
							{ title: { $type: 'string' } }
						]
					}
				}),
				db.createCollection('historyLogs', {
					validator: {
						$or: [
							{ title: { $type: 'string' } }
						]
					}
				})
			]).then( () => {
				console.log('Collections created')
				let adminId = new ObjectID()
				let testTaskId = new ObjectID()
				Promise.all(
					[
						db.collection('users').insertOne({
							_id: adminId,
							username: 'admin',
							email: 'admin@tasker.ninja',
							password: 'dupa',
							creationDate: new Date().getTime()
						}),
						db.collection('tasks').insertOne({
							_id: testTaskId,
							ownerId: adminId,
							title: 'test deadline',
							deadline: new Date().getTime() + 100000,
							creationDate: new Date().getTime()
						}),
						db.collection('historyLogs').insertOne({
							parentTaskId: testTaskId,
							ownerId: 'admin',
							title: 'test history log',
							creationDate: new Date().getTime()
						})
					]
				).then( ()=> {
					console.log('Database initiated')
					res.end('Database initiated')
				}).catch( err => console.log(err))

			})

		}
	}
}

function insertUser(collection, userObj, queryResults, res) {
	if (queryResults.length === 0) {
		usersDb.insert({
				username: data.username,
				password: data.password,
				email: data.email
			},
			{w: 1}
		).then( insertResults => {
			res.end(`User ${data.username} inserted`)
			console.log(`User ${data.username} inserted`)
		})
	} else {
		console.log('Collision')
		res.end('DB collision')
	}
}
