



var $T = function (tsk) {
	var screens = {}
	var GUIelems = tsk.GUIelems = {}
	GUIelems.tasks = {}
	tsk.globals = {
		currentlyAdding: 'red'
	}
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
			if (!Object.assign(this.list[id], updateObj)) throw 'taskerManager.edit() specified task does not exists'
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
			listOfTasks.forEach( function (task, taskIndex) {
				html +=
				'<div class="alertWrapper">'+
				//Alert div, choosing color
					'<div class="alert ' + category +'">'+
						'<span onclick="$T.tasksController.get(' + taskIndex + ').addHistoryRecord(prompt(\'What happened?\')); $T.view.renderAllTasks()" class="alertTitle">' + task.title + '</span>'+
						'<div class="alertButtons"><span>| ' + '2h' + '</span>'+
							'<img src="assets/edit.png" width="15px" height="15px" onclick="$T.tasksController.edit(' + taskIndex + ', {title:prompt(\'Provide a new title\')}); $T.view.renderAllTasks()"></img>'+
							'<img src="assets/delete.png" width="15px" height="15px" onclick="$T.tasksController.remove(' + taskIndex + '); $T.view.renderAllTasks()"></img>'+
						'</div>'+
					'</div>'+
					'<div class="history flex column">'
					task.history.forEach( function (historyRecord, historyRecordId) {
						html +=
						'<div class="historyRecord">' + historyRecord.title +
							'<div class="alertButtons">'+
								'<img src="assets/edit.png" width="15px" height="15px" onclick="$T.tasksController.get(' + taskIndex + ').editHistoryRecord(' + historyRecordId + ', {title:prompt(\'Provide a new title\')}); $T.view.renderAllTasks()"></img>'+
								'<img src="assets/delete.png" width="15px" height="15px" onclick="$T.tasksController.get(' + taskIndex + ').removeHistoryRecord(' + historyRecordId + '); $T.view.renderAllTasks()"></img>'+
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
		GUIelems.dataPicker = document.getElementById('dataPickerPanel')
		GUIelems.dataPicker.titlePicker = document.getElementById('titlePicker')
		GUIelems.dataPicker.datePicker = document.getElementById('datePicker')
		GUIelems.dataPicker.hourPicker = document.getElementById('hourPicker')
		GUIelems.dataPicker.minutePicker = document.getElementById('minutePicker')
		GUIelems.tasks.red = document.getElementById('redTasks')
		GUIelems.tasks.orange = document.getElementById('orangeTasks')
		GUIelems.tasks.yellow = document.getElementById('yellowTasks')
		GUIelems.tasks.green = document.getElementById('greenTasks')


		GUIelems.dataPicker.init = function (category) {
			$T.globals.currentlyAdding = category
			GUIelems.dataPicker.titlePicker.value = ''
			GUIelems.dataPicker.hourPicker.value = ''
			GUIelems.dataPicker.minutePicker.value = ''
			GUIelems.dataPicker.datePicker.value = ''
			GUIelems.dataPicker.style.display = 'block'
		}
		document.onkeydown = function (e) {
			if (e.which === 27) GUIelems.dataPicker.style.display = 'none'
			if (e.key === 'Enter') {
				var title = GUIelems.dataPicker.titlePicker.value
				var hour = GUIelems.dataPicker.hourPicker.value
				var minute = GUIelems.dataPicker.minutePicker.value
				var date = GUIelems.dataPicker.datePicker.value
				console.log(title, hour, minute, date)
				if (title && hour && minute && date) {
					switch (tsk.globals.currentlyAdding) {
						case 'red':
							$T.tasksController.add(title, 1, 1)
							break
						case 'orange':
							$T.tasksController.add(title, 2, 1)
							break
						case 'yellow':
							$T.tasksController.add(title, 1, 2)
							break
						case 'green':
							$T.tasksController.add(title, 2, 2)
							break
						default:
							throw 'No alert category specified'
					}
					$T.view.renderAllTasks()
					GUIelems.dataPicker.style.display = 'none'
				}


			}
		}
		//console.log(GUIelems)
		GUIelems.dataPicker.hourPicker.onkeydown = function (e) {
			var currentValue = GUIelems.dataPicker.hourPicker.value
			if ( isNaN(parseInt(e.key)) && e.key !==  'Backspace' && e.key !==  'F5')  {
				e.preventDefault()
			} else if (parseInt(currentValue + e.key) > 23 || currentValue.length === 2){
				e.preventDefault()
				GUIelems.dataPicker.minutePicker.focus()
				GUIelems.dataPicker.minutePicker.value = e.key
			}
		}
		GUIelems.dataPicker.minutePicker.onkeydown = function (e) {
			var currentValue = GUIelems.dataPicker.minutePicker.value
			if ( isNaN(parseInt(e.key)) || parseInt(currentValue + e.key) > 59
				|| currentValue.length === 2 && e.key !==  'Backspace' && e.key !==  'F5') {
				e.preventDefault()
			}
		}
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
		},
		removeHistoryRecord: function (id) {
			delete this.history[id]
		},
		editHistoryRecord: function (id, updateObj) {
			if (!Object.assign(this.history[id], updateObj)) throw 'task object: .editHistoryRecord() specified record does not exists'
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
