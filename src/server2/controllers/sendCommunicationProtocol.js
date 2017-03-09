let path = require('path')
module.exports = (req, res) => {
	res.sendFile(`${path.resolve('./')}/communicationProtocol.json`)
}
