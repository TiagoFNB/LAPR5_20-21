import { Container } from 'typedi';
const Router = require('express');
import FileUploadController from '../controller/FileUploadController';
const route = Router();
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');

export default (app) => {
	const FileUploadControllerInstance = new FileUploadController(Container.get('FileUpload.service'));

	app.use('/api/fileupload', route);
	//app.use('/api/fileupload', adminGuard, route);
	route.post('', adminGuard.isAdmin, async function(req, res) {
		FileUploadControllerInstance.parseFile(req, res);
	});
};
