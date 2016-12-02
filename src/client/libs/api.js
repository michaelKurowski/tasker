



var $T = function (tsk) {
	var screens = {}
	var GUIelems = {}
	GUIelems.tasks = {}
	tsk.tasksController = {
		list: [],
		add: function (title, urgency, importance, deadline) {
			if (title && (urgency !== undefined) && (importance !== undefined)) {
				this.list.push( createTask(title, parseInt(urgency), parseInt(importance), deadline) )
			} else {
				throw 'tasksController.add(), one or more required arguments is false'
			}
		},
		remove: function (id) {
			delete this.list[id]
		},
		edit: function (id, updateObj) {
			if (!Object.assign(this.list[i], updateObj)) throw 'taskerManager.edit() specified task does not exists'
		},
		get: function (id) {
			return this.list[id]
		},
		getByCategory: function (category) {
			return this.list.map( function (element, index) {
					element.id = index
					return element
				}).filter( function (element) {
				var alertCategory =
					(element.urgency === 1 && element.importance === 1) ? 'red' :
					(element.urgency === 2 && element.importance === 1) ? 'orange' :
					(element.urgency === 1 && element.importance === 2) ? 'yellow' :
					'green'
				return alertCategory === category
			})
		}
	}

	tsk.view = {
		renderAllTasks: function () {
			var self = this
			var tasksController = tsk.tasksController
			var listsOfTasks = [
					tasksController.getByCategory('red'),
					tasksController.getByCategory('orange'),
					tasksController.getByCategory('yellow'),
					tasksController.getByCategory('green')
				]
			listsOfTasks.forEach( function (element, index) {
				var alertCategory =
					(index === 1) ? 'red' :
					(index === 2) ? 'orange' :
					(index === 3) ? 'yellow' :
					'green'
				self.renderTasksByCategory(alertCategory)
			})

		},
		renderTasksByCategory: function (category) {
			var html = ''
			var listOfTasks = tsk.tasksController.getByCategory(category)
			listOfTasks.forEach( function (task) {
				html +=
				'<div class="alertWrapper">'+
				//Alert div, choosing color
					'<div class="alert ' + category +'">'+
						'<span onclick="$T.tasksController.get(' + task.id + ').addHistoryRecord(prompt(\'What happened?\')); $T.view.renderAllTasks()">' + task.title + '</span>'+
						'<div class="alertButtons"><span>' + '2h' + '</span>'+
							'<img src="assets/edit.png" width="15px" height="15px"></img>'+
							'<img src="assets/delete.png" width="15px" height="15px" onclick="$T.tasksController.remove(' + task.id + '); $T.view.renderAllTasks()"></img>'+
						'</div>'+
					'</div>'+
					'<div class="history flex column">'
					task.history.forEach( function (historyRecord) {
						html +=
						'<div class="historyRecord">' + historyRecord.title +
							'<div class="alertButtons">'+
								'<img src="assets/edit.png" width="15px" height="15px"></img>'+
								'<img src="assets/delete.png" width="15px" height="15px"></img>'+
							'</div>'+
						'</div>'
					})
					html +=
					'</div>'+
				'</div>'
			})
			GUIelems.tasks[category].innerHTML = html

		}


	}




	tsk.init = function () {
		GUIelems.login = document.getElementById('loginPanel')
		GUIelems.tasks = document.getElementById('taskerPanel')
		GUIelems.tasks.red = document.getElementById('redTasks')
		GUIelems.tasks.orange = document.getElementById('orangeTasks')
		GUIelems.tasks.yellow = document.getElementById('yellowTasks')
		GUIelems.tasks.green = document.getElementById('greenTasks')
	}




	var taskProto = {
		title: '',
		urgency: 0,
		importance: 0,
		deadline: 0,
		history: [],
		addHistoryRecord: function (name){
			if (!name) throw 'task object : .addHistoryRecord() name argument coers to false'
			var newHistoryRecord = Object.create(historyRecordProto)
			newHistoryRecord.title = name
			newHistoryRecord.timestamp = new Date().getTime()
			this.history.push(newHistoryRecord)
		}
	}

	var historyRecordProto = {
		title: '',
		timestamp: 0
	}

	function createTask(title, urgency, importance, deadline) {
		deadline = deadline || 0
		var newTask = Object.create(taskProto)
		newTask.title = title
		newTask.urgency = urgency
		newTask.importance = importance
		newTask.deadline = deadline
		newTask.history = []
		return newTask
	}

	function login() {
		moveToScreen(screens.login, screens.tasker)
	}


	return tsk
}($T || {})
