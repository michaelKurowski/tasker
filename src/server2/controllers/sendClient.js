let express = require('express')
let path = require('path')
let log = console.log
module.exports = (req, res) => {
	let accessedFile = req.originalUrl.slice(req.route.path.length - 1)
	accessedFile = accessedFile || 'index.html'
	res.sendfile(
		// "../" is consider malicious, path.resolve is neccessary to avoid troubles
		path.resolve(`../client/${accessedFile}`)
	)
}
