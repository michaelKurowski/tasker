var tasksManager = {
	list: [],
	addTask: function (title, urgency, importance, deadline) {
		this.list.push( createTask(title, parseInt(urgency), parseInt(importance), deadline) )
	},//tasksManager.addTask("Dupa", 1, 1)
	deleteTask: function(id) {
		delete this.list[id]
	},
	getTasksByCategory: function (category) {
		return this.list.map( function (element, index) {
				element.id = index
				return element
			}).filter( function (element) {
			var alertCategory =
				(element.urgency === 1 && element.importance === 1) ? 1 :
				(element.urgency === 2 && element.importance === 1) ? 2 :
				(element.urgency === 1 && element.importance === 2) ? 3 :
				4
			return alertCategory === category
		})
	},
	renderTasks: function (tasksCategory, elementHTML) {
		var html = ''
		var listOfTasks = this.getTasksByCategory(tasksCategory)
		listOfTasks.forEach( function (task) {

			html += '<div class="alertWrapper">'

			//Alert div, choosing color
			html += '<div class="alert '
			switch(tasksCategory) {
				case 1:
					html += 'red'
					break
				case 2:
					html += 'orange'
					break
				case 3:
					html += 'yellow'
					break
				case 4:
					html += 'green'
					break
			}
			html += '"'
			html += 'onclick="tasksManager.list[' + task.id + '].addHistoryRecord(prompt(\'What happened?\'))"'
			html += '>'

			html += task.title
			html += '<div class="alertButtons"><span>'
			html += '2h'
			html += '</span><img src="assets/edit.png" width="15px" height="15px"></img><img src="assets/delete.png" width="15px" height="15px"></img></div></div>'
			html += '<div class="history flex column">'
			task.history.forEach( function (historyRecord) {
				html += '<div class="historyRecord">'
				html += historyRecord.title
				html += '<div class="alertButtons"><img src="assets/edit.png" width="15px" height="15px"></img><img src="assets/delete.png" width="15px" height="15px"></img></div>'
				html += '</div>'
			})
			html += '</div>'
			html += '</div>'
		})
		elementHTML.innerHTML = html
	}
}


function api(){
	screens = {}
	screens.login = document.getElementById('loginPanel')
	screens.tasker = document.getElementById('taskerPanel')



}
function login() {
	moveToScreen(screens.login, screens.tasker)
}

function createTask(title, urgency, importance, deadline) {
	deadline = deadline || 0
	var newTask = Object.create(task)
	newTask.title = title
	newTask.urgency = urgency
	newTask.importance = importance
	newTask.deadline = deadline
	return newTask
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
	}
}

var historyRecord = {
	title: '',
	timestamp: 0
}
