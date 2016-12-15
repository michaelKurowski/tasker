module.exports = {
	controllers: {
		login(req, res) {
			res.end('Login')
		},
		signUp(req,res) {
			res.end('Sign up')
		},
		logout(req,res) {
			res.end('Logout')
		},
		save(req, res) {
			res.end('Save')
		},
		load(req, res) {
			res.end('Load')
		}
	}
}
