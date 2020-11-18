const fetch = require('node-fetch')

exports.handler = async function (event, context, callback) {
	const pass = (body) => {
		callback(null, { statusCode: 200, body: JSON.stringify(body) })
	}

	try {
		let response = await fetch('https://api.github.com/graphql', {
			method: event.httpMethod,
			headers: {
				Authorization: `Bearer ${process.env.GIT_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: event.body,
		})

		let data = await response.json()
		pass(data)
	} catch (err) {
		let error = {
			statusCode: err.statusCode || 500,
			body: JSON.stringify({ error: err.message }),
		}
		console.log(err)

		pass(error)
	}
}
