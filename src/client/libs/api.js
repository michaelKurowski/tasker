
function dropLog () {
	var link = document.createElement("a");
	link.download = name;
	link.href = 'data:text/json,' + JSON.stringify($T.tasksController.list);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

var $T = function (tsk) {
	var screens = {}
	var GUIelems = tsk.GUIelems = {}
	GUIelems.tasks = {}
	tsk.globals = {
		currentlyAdding: 'red'
	}
	tsk.tasksController = {
		list: [],
		changed: false,
		add: function (title, urgency, importance, deadline) {
			this.changed = true
			if (title && (urgency !== undefined) && (importance !== undefined)) {
				this.list.push( createTask(title, parseInt(urgency), parseInt(importance), deadline) )
			} else {
				throw 'tasksController.add(), one or more required arguments is false'
			}
			this.checkUrgency()
		},
		remove: function (id) {
			this.changed = true
			this.list.splice(id, 1)

		},
		edit: function (id, updateObj) {
			this.changed = true
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
		},
		checkUrgency: function () {
			var self = this
			this.list = this.list.map( function (element) {
				if (element.urgency === 2) {

					var daysToDeadline = Math.round((element.deadline - new Date().getTime()) / (60*60*24*1000))
					if (daysToDeadline < 1) {
						self.changed = true
						element.urgency = 1
					}

				}
				var hoursToDeadline = (element.deadline - new Date().getTime()) / (60*60*1000)
				if (hoursToDeadline < 1 && !element.veryUrgent) {
					var audio = new Audio('assets/bell.mp3')
					audio.play()
					self.changed = true
					element.veryUrgent = true
				}
				if (hoursToDeadline < 0) {
					self.changed = true
					element.obsolete = true
				}
				return element
			})
		},
		saveToCookies: function () {
			localStorage.setItem('saveData', JSON.stringify(this.list))
		},
		loadFromCookies: function () {
			this.list = JSON.parse(localStorage.getItem('saveData'))
			this.list.forEach( function (element, index, arr) {
				var newTask = Object.create(taskProto)
				var updatedTask = Object.assign(newTask, element)
				arr[index] = updatedTask
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

				var timeUnit = 'd'
				var toDeadline = Math.round((task.deadline - new Date().getTime()) / (60*60*24*1000))
				if (toDeadline < 1) {
					timeUnit = 'h'
					toDeadline = Math.round((task.deadline - new Date().getTime()) / (60*60*100))/10
					if (toDeadline < 1) {
						timeUnit = 'm'
						toDeadline = Math.round((task.deadline - new Date().getTime()) / (60*1000))
					}
				}
				console.log(task.deadline - new Date().getTime())
				var alertCategory = category
				if (task.obsolete) alertCategory = 'grey'
				if (task.veryUrgent) alertCategory += ' blinking'
				//console.log()

				html +=
				'<div class="alertWrapper">'+
				//Alert div, choosing color
					'<div class="alert ' + alertCategory + '">'+
						'<span onclick="$T.tasksController.get(' + task.id + ').addHistoryRecord(prompt(\'What happened?\')); $T.view.renderAllTasks()" class="alertTitle">' + task.title + '</span>'+
						'<div class="alertButtons"><span>| ' + toDeadline + timeUnit + '</span>'+
							'<img src="assets/edit.png" width="15px" height="15px" onclick="$T.tasksController.edit(' + task.id + ', {title:prompt(\'Provide a new title\')}); $T.view.renderAllTasks()"></img>'+
							'<img src="assets/delete.png" width="15px" height="15px" onclick="$T.tasksController.remove(' + task.id + '); $T.view.renderAllTasks()"></img>'+
						'</div>'+
					'</div>'+
					'<div class="history flex column">'
					task.history.forEach( function (historyRecord, historyRecordId) {
						html +=
						'<div class="historyRecord">' + historyRecord.title +
							'<div class="alertButtons">'+
								'<img src="assets/edit.png" width="15px" height="15px" onclick="$T.tasksController.get(' + task.id + ').editHistoryRecord(' + historyRecordId + ', {title:prompt(\'Provide a new title\')}); $T.view.renderAllTasks()"></img>'+
								'<img src="assets/delete.png" width="15px" height="15px" onclick="$T.tasksController.get(' + task.id + ').removeHistoryRecord(' + historyRecordId + '); $T.view.renderAllTasks()"></img>'+
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
		console.log('cookie', document.cookie)
		if (localStorage.getItem('saveData') !== '') tsk.tasksController.loadFromCookies()


		GUIelems.login = document.getElementById('loginPanel')
		GUIelems.tasks = document.getElementById('taskerPanel')
		GUIelems.dataPicker = document.getElementById('dataPickerPanel')
		GUIelems.dataPicker.titlePicker = document.getElementById('titlePicker')
		GUIelems.dataPicker.datePicker = document.getElementById('datePicker')
	//	GUIelems.dataPicker.datePicker = document.getElementById('datePicker')

		GUIelems.tasks.red = document.getElementById('redTasks')
		GUIelems.tasks.orange = document.getElementById('orangeTasks')
		GUIelems.tasks.yellow = document.getElementById('yellowTasks')
		GUIelems.tasks.green = document.getElementById('greenTasks')
		GUIelems.taskCreatorForm = document.getElementById('taskCreatorForm')
		document.onkeydown = function (e) {
			if (e.key === 'Escape') GUIelems.dataPicker.style.display = 'none'
		}
		GUIelems.taskCreatorForm.onsubmit = function () {
			var inputs = this.querySelectorAll('input')
			var title = inputs[0].value
			var deadline = new Date(inputs[1].value).getTime()
			console.log(new Date(deadline))
			if (deadline < new Date().getTime()) {

				console.log(deadline, new Date(), deadline.getTime() < new Date().getTime())
				alert('You can not set past date as the deadline.')
				return false
			}
			switch (tsk.globals.currentlyAdding) {
				case 'red':
					$T.tasksController.add(title, 1, 1, deadline)
					break
				case 'orange':
					$T.tasksController.add(title, 2, 1, deadline)
					break
				case 'yellow':
					$T.tasksController.add(title, 1, 2, deadline)
					break
				case 'green':
					$T.tasksController.add(title, 2, 2, deadline)
					break
				default:
					throw 'No alert category specified'
			}
			GUIelems.dataPicker.style.display = 'none'
			return false
		}

		GUIelems.dataPicker.init = function (category) {
			$T.globals.currentlyAdding = category
			GUIelems.dataPicker.titlePicker.value = ''
			GUIelems.dataPicker.datePicker.value = toDateInput(new Date())
			GUIelems.dataPicker.style.display = 'block'

		}
		setInterval( function () {
			tsk.tasksController.checkUrgency()
			if (tsk.tasksController.changed){
				tsk.tasksController.saveToCookies()
				tsk.view.renderAllTasks()
			}
			tsk.tasksController.changed = false
		}, 1000)

		setInterval(function () {
			Array.from(document.querySelectorAll('.tipOfTheDay')).forEach( function (element) {
				element.innerHTML = config.tips[Math.round(Math.random() * config.tips.length)]
			})
		}, 60000)
		tsk.view.renderAllTasks()
	}




	var taskProto = {
		title: '',
		urgency: 0,
		importance: 0,
		deadline: 0,
		veryUrgent: false,
		history: [],
		obsolete: false,
		addHistoryRecord: function (name){
			tsk.tasksController.changed = true
			if (!name) throw 'task object : .addHistoryRecord() name argument coers to false'
			var newHistoryRecord = Object.create(historyRecordProto)
			newHistoryRecord.title = name
			newHistoryRecord.timestamp = new Date().getTime()
			this.history.unshift(newHistoryRecord)
		},
		removeHistoryRecord: function (id) {
			tsk.tasksController.changed = true
			delete this.history[id]
		},
		editHistoryRecord: function (id, updateObj) {
			tsk.tasksController.changed = true
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
		newTask.veryUrgent = false
		return newTask
	}

	function login() {
		moveToScreen(screens.login, screens.tasker)
	}
	function toDateInput(date) {
		var month = (date.getMonth() < 9) ? '0'+(date.getMonth()+1) : date.getMonth()+1
		var day = (date.getDate() < 10) ? '0'+date.getDate() : date.getDate()
		var hour = (date.getHours() < 10) ? '0'+(date.getHours()-1) : date.getHours()-1
		var minute = (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()
		return date.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute
	}

	return tsk
}($T || {})
