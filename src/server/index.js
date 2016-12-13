//Lets require/import the HTTP module
const http = require('http');
const cfg = require('./config.json');
//Lets define a port we want to listen to
console.log(cfg)

//We need a function which handles requests and send response
function handleRequest(req, res){
	console.log(
		req
	)
    res.end('It Works!! Path Hit: ' + req.url);
}

//Create a server
const server = http.createServer(handleRequest);

//Lets start our server
server.listen(cfg.listeningPort, () => console.log(`Listening on: http://localhost:${cfg.listeningPort}`))
