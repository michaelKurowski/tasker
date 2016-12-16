document.addEventListener('DOMContentLoaded', function () {
	$T.init()
	console.log(
		ajax(
			//'I\'m testing',
			'{"test": 2}',
			{200: res => console.log(res)},
			'http://localhost:8000/login'
		)
	)
})
