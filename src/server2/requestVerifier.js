//Sets headers etc
const cfg = require('./config.json')
module.exports = (req, res, next) => {
	if (cfg.devInstance) {
		cfg.httpServerResponsesHeader.developerInstance.forEach( rule =>
			res.set(rule.header, rule.value)
		)
	} else {
		cfg.httpServerResponsesHeader.productionInstance.forEach( rule =>
			res.set(rule.header, rule.value)
		)
	}
	next()
}
