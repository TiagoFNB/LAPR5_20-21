const bootstrapper = require('./DIbootstrapper'); // DO NOT REMOVE THIS LINE, IT MAY SEEM ITS NOT BEING USED BUT IT IS!!
import expressLoader from './express';
import mongooseLoader from './mongoose';
import nodeRoutes from '../Node/Routes/Node_Routes';
import Line_Routes from '../Line/routes/Line_Routes';
import Path_Routes from '../Path/routes/Path_Routes';
import DriverType_Routes from '../DriverType/routes/DriverType_Routes';
import FileUpload_Routes from '../FileUpload/routes/FileUpload_Routes';
import VehicleType_Routes from '../VehicleType/routes/VehicleType_Routes';

export default async ({ expressApp }) => {
	const mongoConnection = await mongooseLoader();
	console.log('MongoDB Intialized');

	await expressLoader({ app: expressApp }).then((app) => {
		console.log('Express Intialized');
		Line_Routes(app);
		nodeRoutes(app);
		Path_Routes(app);
		DriverType_Routes(app);
		FileUpload_Routes(app);
		VehicleType_Routes(app);
	});

	// ... more loaders can be here

	// ... Initialize agenda
	// ... or Redis, or whatever you want
};
