
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
		},
		remove: function (id) {
			this.changed = true
			delete this.list[id]
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
					self.changed = true
					element.veryUrgent = true
				}
				return element
			})
		},
		saveToCookies: function () {
			if (this.changed) {
				localStorage.setItem('saveData', JSON.stringify(this.list))
			}
		},
		loadFromCookies: function () {
			this.list = JSON.parse(localStorage.getItem('saveData'))
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
				var alertCategory = category
				if (task.veryUrgent) alertCategory += ' blinking'
				//console.log()

				html +=
				'<div class="alertWrapper">'+
				//Alert div, choosing color
					'<div class="alert ' + alertCategory + '">'+
						'<span onclick="$T.tasksController.get(' + taskIndex + ').addHistoryRecord(prompt(\'What happened?\')); $T.view.renderAllTasks()" class="alertTitle">' + task.title + '</span>'+
						'<div class="alertButtons"><span>| ' + toDeadline + timeUnit + '</span>'+
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
		console.log('cookie', document.cookie)
		if (localStorage.getItem('saveData') !== '') tsk.tasksController.loadFromCookies()


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
				var dateTimestamp = Date.parse(date + ' ' + hour + ':' + minute + ':00')
				console.log(dateTimestamp, new Date().getTime(), dateTimestamp > new Date().getTime())
				if (dateTimestamp < new Date().getTime()) {
					alert('You can not set a past date as a deadline.')
				}
				if (title && hour && minute && date && dateTimestamp > new Date().getTime()) {

					switch (tsk.globals.currentlyAdding) {
						case 'red':
							$T.tasksController.add(title, 1, 1, dateTimestamp)
							break
						case 'orange':
							$T.tasksController.add(title, 2, 1, dateTimestamp)
							break
						case 'yellow':
							$T.tasksController.add(title, 1, 2, dateTimestamp)
							break
						case 'green':
							$T.tasksController.add(title, 2, 2, dateTimestamp)
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

		setInterval( function () {
			if (tsk.tasksController.changed){
				tsk.tasksController.saveToCookies()
				tsk.tasksController.checkUrgency()
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
		addHistoryRecord: function (name){
			tsk.tasksController.changed = true
			if (!name) throw 'task object : .addHistoryRecord() name argument coers to false'
			var newHistoryRecord = Object.create(historyRecordProto)
			newHistoryRecord.title = name
			newHistoryRecord.timestamp = new Date().getTime()
			this.history.push(newHistoryRecord)
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


	return tsk
}($T || {})
