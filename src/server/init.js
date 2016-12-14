const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const http = require('http')

module.exports = {
	//Connects to DB, returns promise with db connection object
	connectToDb(url, username, password) {
		return new Promise( (resolve, reject) => {
			MongoClient.connect(cfg.mongoDbUrl, (err, db) => {
			  assert.equal(null, err)
			  console.log("Connected correctly to MongoDB Server.")
			  resolve(db)
			})
		})
	},
	startHttpServer(port, responsesHandler, cb) {
		cb = cb || () => console.log(`Http Server listening on port ${port}`)
		const server = http.createServer(responsesHandler)
		server.listen(port, cb)
	}
}
