'use strict'
module.exports = {
	controllers: {
		login(req, res, db, data, sessionsManagement) {
			//console.log(sessionsManagement.sessions)
			if (sessionsManagement.getIdFromSession(data.token)) {
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
						email: data.email,
						tasks: []
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
			console.log('data: ', data.tasks, data.username)
			if (data.tasks && data.username) {
				const query = db.collection('users').update(
					{username: data.username},
					{$set: {tasks: data.tasks}}
				)
				query.catch( insertErr => {
					console.log('err:', insertErr)
					res.end(  JSON.stringify(insertErr)  )
				})
				query.then( insertResults => {
					res.end(`User ${data.username} updated`)
					console.log(`User ${data.username} updated`)
				})
			}
			res.end('Save')
		},
		load(req, res, db, data, sessionsManagement) {
			if (data.username || data.password) {

				const queryPromise = new Promise( (resolve, reject) => {
					db.collection('users').find({
							username: data.username
						},
						{tasks: 1},
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
						console.log(`${data.username} returned tasks.`, result)
						//console.log(result)
						res.end(  JSON.stringify(result[0].tasks)  )
					})
				})
			} else {
				res.end('No data')
			}
			//res.end('Load')
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
