//Lets require/import the HTTP module
const cfg = require('./config.json')

const $T = Object.assign( {},
	require('./init.js')
)
console.log($T)
//We need a function which handles requests and send response
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

$T.connectToDb(cfg.mongoDbUrl)
$T.startHttpServer(cfg.httpListeningPort, handleRequest)
