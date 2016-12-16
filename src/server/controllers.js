'use strict'
module.exports = {
	controllers: {
		login(req, res, db, data) {
			let testDocs = [
				{"username": "Byamarro1", "email": "Byamarro@gmail.com", "password": "dupa"},
				{"username": "Byamarro2", "email": "Byamarro@gmail.com", "password": "dupa"},
			]
			res.end(JSON.stringify(data))

			db.collection('users').insert(testDocs, {w: 1}, (err, result) => {
				console.log(result)
				if (!err) res.end('Login', result)
				res.end('Login', err)
			})

		},
		signUp(req, res, db, data) {
			console.log('signUp data', data)

			//console.log('single data', data)
			if (data.username && data.password && data.email) {
				console.log('all data received')
				const usersDb = db.collection('users')
				usersDb.find({
					$or: [
						{username: data.username},
						{email: data.email}
					]
				}).toArray()
				.then( queryResults => {
					//If there are no users fullfiling criteri then  add the user to the db
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
				})
			}
			res.end('Sign up')
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
