import 'reflect-metadata';
const loaders = require('./Loaders');
const express = require('express');

async function startServer() {
	const app = express();
	// const port = 3000;

	await loaders.default({ expressApp: app });

	const port = process.env.PORT || 3000;

	app.listen(port, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`Your server is ready !`);
	});
}

startServer();
