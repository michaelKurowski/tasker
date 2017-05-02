const should = require('should')
const assert = require('assert')
const request = require('supertest')
const cfg = require('../../config.json')
const routes = require('../../routes.json')




//extracts pure controller name
const controllerName = __filename.slice(__dirname.length + 1, __filename.length - 3)
const url = cfg.address + ':' + cfg.httpPort

const api = routes.filter(route => route.controller === controllerName)[0].path
describe('Routing ' + api, () => {
	before(done => done())
	describe('Checking http status code for empty packet', () => {
    it('should forbid access in case if not public', done => {
      let body = {}
    request(url)
			.post(api)
			.send(body)
			.expect(200)
			//end handles the response
			.end((err, res) => {
        if (err) throw err
				//Should syntax: res.status.should.be.equal(400)
        done()
      })
		})
		it('should affect ... endpoint', done => {
			let body = {}
			request(url)
				.put('/my/route')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200) //Status code
				.end((err, res) => {
					if (err) throw err
					/* Example
					res.body.should.have.property('_id')
          res.body.creationDate.should.not.equal(new Date().getTime())
					*/
					done()
				}
			)
		})
  })
})
