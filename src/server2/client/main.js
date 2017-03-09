document.addEventListener('DOMContentLoaded', function () {
	$T.init()
	console.log(
		/*
		ajax(
			//'I\'m testing',
			'{"username": "Byamarro", "email": "Byamarro@gmail.com", "password": "dupa"}',
			{200: res => console.log(res)},
			'http://localhost:8000/login'
		),*/
		ajax(
			//'I\'m testing',
			'{"username": "Byamarro10", "email": "Byamarro10@gmail.com", "password": "dupa"}',
			{200: res => console.log(res)},
			'http://localhost:8000/signUp'
		)
	)
})
