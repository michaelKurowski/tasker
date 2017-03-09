let path = require('path')
module.exports = (req, res) => {
	let accessedFile = req.originalUrl.slice(req.route.path.length - 1)
	accessedFile = accessedFile || 'index.html'
	res.sendFile(`${path.resolve('./client')}/${accessedFile}`)
}
