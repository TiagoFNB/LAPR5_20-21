import { Path_GetListController } from './../controller/Path_GetListController';
import { Container } from 'typedi';
const Router = require('express');

import Path_Controller from '../controller/Path_Controller';
const adminGuard = require('../../AuthGuard/AdminGuard');
const managerGuard = require('../../AuthGuard/ManagerGuard');
const userGuard = require('../../AuthGuard/UserGuard');
const route = Router();

/*
* Routes for path operations

THIS NEEDS TO CHANGE A BIT
*/
export default (app) => {
	//Prefix definition
	const pathContrInst = new Path_Controller(Container.get('path.CreateService'));
	const pathListContrInst = new Path_GetListController(Container.get('path.getListService'));

	app.use('/api/path', route);
	//Post Route
	route.post('/register', adminGuard.isAdmin, async function(req, res) {
		pathContrInst.registerPath(req, res);
	});

	route.get('', userGuard.isUser, async function(req, res) {
		pathListContrInst.getList(req, res);
	});

	//Obtain path
	route.get('/:key', userGuard.isUser, async function(req, res) {
		pathListContrInst.getPath(req,res)});
};
