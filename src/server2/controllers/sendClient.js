let express = require('express')
let path = require('path')
let log = console.log
module.exports = (req, res) => {
	let accessedFile = req.originalUrl.slice(req.route.path.length - 1)
	accessedFile = accessedFile || 'index.html'
	res.sendFile(
		// "../" is consider dangerous in some cases,
		// path.resolve is neccessary to avoid restrictions
		`${path.resolve('../client')}/${accessedFile}`
	)
}
