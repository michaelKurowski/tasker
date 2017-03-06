const fs = require('fs')
const chalk = require('chalk')
const log = console.log
module.exports = (
	/*
	Array of objects that contains data about files to generate.
	This function will iterate through all objects and create files based on
	fileNameProperty argument.
	*/
	listOfObjects,
	//Directory to output files
	destinationPath,
	//Property in config file that defined files names
	fileNameProperty,
	//Default string that will be outputted to file
	defaultContent
	) => {
	let filesCreationPromises = []
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
								log('Created file: ', outputPath)
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
