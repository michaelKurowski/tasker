
const cfg = require('./config.json')
const taskerVersion = require('./package.json').version
const $T = Object.assign( {},
	require('./init.js')
)

function handleRequest(req, res){
	console.log(
		req
	)
	res.setHeader('Access-Control-Allow-Origin', 'null')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
	res.setHeader('Access-Control-Allow-Credentials', true)
    res.end('It Works!! Path Hit: ' + req.url);
}
Promise.all([
	$T.connectToDb(cfg.mongoDbUrl),
	$T.startHttpServer(cfg.httpListeningPort, handleRequest)
]).then(
	val => console.log(`Tasker ${taskerVersion} server is running`)
)
