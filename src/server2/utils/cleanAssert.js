const assert = require('assert')
module.exports = {
	deepEqual: (obj1, obj2) => {
		try {
			assert.deepEqual(obj1, obj2)
		} catch (err) {
			return false
		}
		return true
	}
}
