const fs = require('fs')
const chalk = require('chalk')
const log = console.log
const path = require('path')
//creates multiple .js files
module.exports = (
	/*
	Array of objects that contains data about files to generate.
	This function will iterate through all objects and create files based on
	fileNameProperty argument.
	example:
		[
			{
				myFileName: 'file01',
				otherThing: 4
			},
			{
				myFileName: 'file02',
				otherThing: 1
			}
		]
		myFileName property is taken from fileNameProperty argument of this function
	*/
	listOfObjects,
	//Directory to output files
	destinationPath,
	//Property in config file that defined files names
	fileNameProperty,
	//Default string that will be outputted to file
	defaultContent,
	//Log creation of new files to console
	logToConsole = true
	) => {
	let filesCreationPromises = []
	if ( !fs.existsSync(destinationPath) ) fs.mkdirSync(destinationPath)
	if (listOfObjects.length === 0)
		return Promise.reject('List of files to create is empty.')
	let correctCheck = listOfObjects.filter(elem => elem[fileNameProperty] !== undefined)
	if (correctCheck.length !== listOfObjects.length)
		return Promise.reject('At least one element from list of files to create, doesn\'t contains specified name property.')
	listOfObjects.forEach( (element, index) => {
		let outputPath = `${destinationPath}/${element[fileNameProperty]}.js`
		if ( !fs.existsSync(outputPath) ) {
			filesCreationPromises.push(
				new Promise( (resolve, reject) => {
					fs.writeFile(
						outputPath,
						defaultContent,
						err => {
							if (err) {
								reject(err)
								log(chalk.red(err))
							} else {
								if (logToConsole) log('Created file: ', outputPath)
								resolve()
							}
						}
					)
				})
			)
		}
	})
	if (filesCreationPromises.length !== 0)
		return Promise.all(filesCreationPromises)
	//If there are no files to create, function outputs fullfiled promise
	return Promise.resolve()
}
