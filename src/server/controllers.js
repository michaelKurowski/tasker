'use strict'
module.exports = {
	controllers: {
		login(req, res, db, data) {
			let testDocs = [
				{title: 'My doc1'},
				{title: 'My doc2'},
			]
			res.end(data)
			/*
			db.collection('dupa').insert(testDocs, {w: 1}, (err, result) => {
				console.log(result)
				if (!err) res.end('Login', result)
				res.end('Login', err)
			})
			*/
		},
		signUp(req, res, db, data) {

			db.collection('dupa').find({title:'My doc1'}).toArray((err, items) => {
				console.log(items)
			})
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
