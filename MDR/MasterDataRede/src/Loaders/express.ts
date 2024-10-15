import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ApplicationBootstrap } from '@node-ts/bus-core';
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
var cors = require('cors');
export default async ({ app }: { app: express.Application }) => {
	const accessTokenSecret = 'MyPaSsWoRdIsBeTtErThEnYoUrS';
	const authenticateJWT = (req, res, next) => {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const token = authHeader.split(' ')[1];

			jwt.verify(token, accessTokenSecret, (err, user) => {
				if (err) {
					return res.sendStatus(403);
				}

				req.user = user;
				next();
			});
		} else {
			res.sendStatus(401);
		}
	};

	// app.get('/status', (req, res) => { res.status(200).end(); });
	//app.head('/status', (req, res) => { res.status(200).end(); });
	//app.enable('trust proxy');

	app.options('*', cors());
	app.use(cors());
	//app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(
		fileUpload({
			createParentPath: true,
			useTempFiles: true,
			tempFileDir: '/tmp/'
		})
	);
	app.use(authenticateJWT);

	//app.use('/api/node',nodeRoute);

	return app;
};
