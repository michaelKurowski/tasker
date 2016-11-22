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
	htmlElement.onclick = function () {
		if (!hasBeenActivated){
			htmlElement.value = ''
			htmlElement.style.color = 'black'
		}
		hasBeenActivated = true
	}
}

function toArray(hostObj){ //converts host object to array
	var newArray = []
	for (var i = 0 ; i < hostObj.length ; i++) {
		newArray.push(hostObj[i])
	}
	return newArray
}
