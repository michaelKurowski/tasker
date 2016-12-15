
const cfg = require('./config.json')
const taskerVersion = require('./package.json').version
const $T = Object.assign( {},
	require('./init.js'),
	require('./controllers.js')
)
const instanceType = (cfg.devInstance) ? 'developerInstance' : 'productionInstance'

function handleRequest(req, res){
	//Extracts slice of path after '/' in request url
	const requestAction = req.url.slice(1)

	//Sets response header according to config.json
	cfg.httpServerResponsesHeader[instanceType]forEach(
		record => res.setHeader(record.header, record.value)
	)
	//Redirects to a proper controller
	if ($T.controllers[requestAction]) {
		$T.controllers[requestAction](req, res)
	} else {
		res.end('Undefined action')
	}
}
Promise.all([
	$T.connectToDb(cfg.mongoDbUrl),
	$T.startHttpServer(cfg.httpListeningPort, handleRequest)
]).then(
	val => console.log(`Tasker ${taskerVersion} server is running.`, val)
)
