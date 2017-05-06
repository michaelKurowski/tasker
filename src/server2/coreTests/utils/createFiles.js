const chai = require('chai')
chai.use(require('chai-as-promised'))
let expect = chai.expect

const createFiles = require('../../utils/createFiles.js')
const fs = require('fs')


function checkIfFilesExist(pathes) {
	return pathes.map( filePathToCheck =>
		new Promise( (resolve, reject) =>
			fs.stat(filePathToCheck, (err, stat) => {
					if (!err) return resolve()
					reject(err)
			})
		)
	)
}

describe('Utils -> createFiles()', () => {
	let filesArray = [
		{name: 'abc'},
		{name: 'abcd'},
		{name: 'abcdef'},
		{name: 'abcdefgh'}
	]
	let filesDirectory = __dirname + '/testFiles'
	let fileNameProperty = 'name'
	let fileContent = 'module.exports = () => 200'
	let filesPathes = filesArray.map( elem => `${filesDirectory}/${elem.name}.js`)


	before(done => done())
	describe('Creating standard files', () => {
		//init vars
    it('should return fulfilled promise', () => {
			return createFiles(
				filesArray,
				filesDirectory,
				fileNameProperty,
				fileContent,
				false
			)
		})
		it('should create files', () => {
			return Promise.all(checkIfFilesExist(filesPathes))
		})
		after('Clearing test files', () => {
			let filesRemovalPromises = filesPathes.map( filePath =>
				new Promise( (resolve, reject) => {
					fs.unlink(filePath, err => {
						if (!err) return resolve()
						reject(err)
					})
				})
			)
			return Promise.all(filesRemovalPromises)
		})
	})
	describe('Passing empty list of files', () => {
		let filesArray = []
		it('should return rejected promise', () => {
			return expect(
				createFiles(
					filesArray,
					filesDirectory,
					fileNameProperty,
					fileContent,
					false
				)
			).to.eventually.be.rejected
		})
		it('should not create files', () => {
			return expect(
				Promise.all(checkIfFilesExist(filesPathes))
			).to.eventually.be.rejected
		})
	})
	describe('Some of objects from list of files to create lacking file name property', () => {
		let filesArray = [
			{name: 'abc'},
			{name: 'abcd'},
			{nameTwo: 'abcdef'},
			{name: 'abcdefgh'}
		]
		it('should return rejected promise', () => {
			return expect(
				createFiles(
					filesArray,
					filesDirectory,
					fileNameProperty,
					fileContent,
					false
				)
			).to.eventually.be.rejected
		})
		it('should not create files', () => {
			return expect(
				Promise.all(checkIfFilesExist(filesPathes))
			).to.eventually.be.rejected
		})
	})
})
