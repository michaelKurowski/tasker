'use strict'
module.exports = {
	controllers: {
		login(req, res, db, data) {
			if (data.username || data.password) {

				const queryPromise = new Promise( (resolve, reject) => {
					db.collection('users').find({
							username: data.username,
							password: data.password
						},
						{w: 1},
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
						console.log(`${data.username} logged in.`)
						//console.log(result)
						console.log(req)
						res.end(  JSON.stringify(result)  )
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
					console.log(insertErr)
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
		logout(req, res, db, data) {
			res.end('Logout')
		},
		save(req, res, db, data) {
			res.end('Save')
		},
		load(req, res, db, data) {
			res.end('Load')
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
