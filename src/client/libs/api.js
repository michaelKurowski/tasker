function api(){
	screens = {}
	screens.login = document.getElementById('loginPanel')
	screens.tasker = document.getElementById('taskerPanel')

}
function login() {
	moveToScreen(screens.login, screens.tasker)
}


function createTask() {

}

var task = {
	title: '',
	urgency: 0,
	importance: 0,
	deadline: 0,
	history: [],
	addHistoryRecord: function (name){
		var newHistoryRecord = Object.create(historyRecord)
		newHistoryRecord.title = name
		newHistoryRecord.timestamp = new Date().getTime()
		this.history.push(newHistoryRecord)
	},
	delete: function () {

	}
}

var historyRecord = {
	title: '',
	timestamp: 0
}
