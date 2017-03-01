const MongoClient = require('mongodb').MongoClient
const cfg = require('./config.json')
const assert = require('assert')

let dbConnection = new Promise( (resolve, reject) => {
	console.log('Connecting to MongoDB server...')
	MongoClient.connect(cfg.mongoDbUrl, (err, db) => {
		assert.equal(null, err)
		console.log('Connected correctly to MongoDB server.')
		resolve(db)
	})
})
module.exports = Promise.all([dbConnection])
