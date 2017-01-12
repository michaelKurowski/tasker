//DOCUMENT PARSER

window.onload = function () {

	//APPLIES LOGIC TO INPUTS
	var inputsHostObj = document.getElementsByClassName('inputField')
	toArray(inputsHostObj).forEach( function (element) {
		declareInputField(element)
	})
}
/*
	Response handler is an object that holds various functions for different statuses of request i.e.
	{
		200: function (responseText) {console.log(responseText, 'succesfull')},
		404: function (responseText) {console.log('Not found :(')}
	}

	data is just a plain string
*/
function ajax(data, responseHandlerObject, address, method) {
	method = method || 'POST'
	var request = new XMLHttpRequest()
	request.open(method, address, true)
	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			if (responseHandlerObject[request.status]) {
				responseHandlerObject[request.status](request.responseText)
			} else {
				console.log('Not defined response', request)
			}
		}
	}
	//request.setRequestHeader('content-type', 'json/text')
	request.send(data)
}

function declareInputField(htmlElement) {
	htmlElement.style.color = 'silver'
	var hasBeenActivated = false
	var originalValue = htmlElement.value
	htmlElement.onfocus = function () {
		if (!hasBeenActivated){
			htmlElement.value = ''
			htmlElement.style.color = 'black'
		}
		hasBeenActivated = true
	}
	htmlElement.onblur = function () {
		if (!htmlElement.value) {
			htmlElement.style.color = 'silver'
			htmlElement.value = originalValue
			hasBeenActivated = false
		}
	}
}

function declareDropDownMenu(htmlElement, unrollElement) {
	htmlElement.onmouseover = function () {
		//htmlElement
	}
}

function toArray(hostObj){ //converts host object to array
	var newArray = []
	for (var i = 0 ; i < hostObj.length ; i++) {
		newArray.push(hostObj[i])
	}
	return newArray
}

function moveToScreen(actualScreen, nextScreen) {
	console.log(nextScreen.classList)
	actualScreen.classList.add('oneTimeAnim')
	console.log(actualScreen.classList)
	nextScreen.classList.remove('hide')
	console.log(actualScreen.classList)
	nextScreen.classList.add('oneTimeAnim')
	console.log(nextScreen.classList)
	actualScreen.style.animationName = 'switchOut'
	nextScreen.style.animationName = 'switchIn'
	setTimeout( function () {
		actualScreen.classList.add('hide')
	}, 1000

	)
}
