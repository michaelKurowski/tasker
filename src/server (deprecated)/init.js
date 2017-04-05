const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const http = require('http')

module.exports = {
	//Connects to DB, returns promise with db connection objecta
	connectToDb(url, username, password) {
		console.log('Connecting to MongoDB server...')
		return new Promise( (resolve, reject) => {
			MongoClient.connect(url, (err, db) => {
			  assert.equal(null, err)
			  console.log('Connected correctly to MongoDB server.')
			  resolve(db)
			})
		})
	},
	//Starts to listen on a specified port
	startHttpServer(port, responsesHandler, cb) {
		return new Promise( (resolve, reject) => {
			cb = cb || (() => console.log(`Http Server listening on port ${port}`))
			const server = http.createServer(responsesHandler)
			server.listen(port, () => {
				cb()
				resolve(server)
			})
		})
	}
}
