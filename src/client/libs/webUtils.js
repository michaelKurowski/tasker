//DOCUMENT PARSER

window.onload = function () {

	//APPLIES LOGIC TO INPUTS
	var inputsHostObj = document.getElementsByClassName('inputField')
	toArray(inputsHostObj).forEach( function (element) {
		declareInputField(element)
	})

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

function toArray(hostObj){ //converts host object to array
	var newArray = []
	for (var i = 0 ; i < hostObj.length ; i++) {
		newArray.push(hostObj[i])
	}
	return newArray
}
