import { FileImportComponent } from './import/fileimport.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverTypeRegistrationComponent } from './registrations/driver-type-registration/driver-type-registration.component';
import { LineRegistrationComponent } from './registrations/line-registration/line-registration.component';
import { PathRegistrationComponent } from './registrations/path-registration/path-registration.component';
import { NodeRegistrationComponent } from './registrations/node-registration/node-registration.component';
import { VehicleTypeRegistrationComponent } from './registrations/vehicle-type-registration/vehicle-type-registration.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PlanningComponent } from './planning/planning.component';
import { View2dComponent } from './view2d/view2d.component';
import { VehicleRegistrationComponent } from './registrations/vehicle-registration/vehicle-registration.component';
import { LoginComponent } from './login/login.component';
import { AdminAuthGuard } from './core/guards/adminAuth.guard';
import { UserAuthGuard } from './core/guards/userAuth.guard';
import { ManagerAuthGuard } from './core/guards/managerAuth.guard';
import { UserRegistrationComponent } from './registrations/user-registration/user-registration.component';
import { DriverDutyRegistrationComponent } from './registrations/driver-duty-registration/driver-duty-registration.component';
import { DriverRegistrationComponent } from './registrations/driver-registration/driver-registration.component';
import { RetrievePasswordComponent } from './retrieve-password/retrieve-password.component';
import { VehicleDutyRegistrationComponent } from './registrations/vehicle-duty-registration/vehicle-duty-registration.component';
import { TripRegistrationComponent } from './registrations/trip-registration/trip-registration.component';
import { WorkblockRegistrationComponent } from './registrations/workblock-registration/workblock-registration.component';
import { ListingsComponent } from './listings/listings.component';
import { LineListingComponent } from './listings/line-listing/line-listing.component';
import { PathListingComponent } from './listings/path-listing/path-listing.component';
import { VehicleDutyListingComponent } from './listings/vehicle-duty-listing/vehicle-duty-listing.component';
import { NodeListingComponent } from './listings/node-listings/node-listing.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { DriverDutyListingComponent } from './listings/driver-duty-listing/driver-duty-listing.component';

const routes: Routes = [
	{
		path: 'registrations',
		component: RegistrationsComponent,
		canActivate: [ AdminAuthGuard ],
		children: [
			{
				path: 'node', // child route path
				component: NodeRegistrationComponent, // child route component that the router renders,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'line-registration',
				component: LineRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'driverType',
				component: DriverTypeRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'driverDuty',
				component: DriverDutyRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'path',
				component: PathRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'vehicleType', // child route path
				component: VehicleTypeRegistrationComponent, // child route component that the router renders
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'vehicle', // child route path
				component: VehicleRegistrationComponent, // child route component that the router renders
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'vehicleDuty',
				component: VehicleDutyRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'trip', // child route path
				component: TripRegistrationComponent, // child route component that the router renders
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'driver',
				component: DriverRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			},
			{
				path: 'workblock',
				component: WorkblockRegistrationComponent,
				canActivate: [ AdminAuthGuard ]
			}
		]
	},

	{
		path: 'listings',
		component: ListingsComponent,
		canActivate: [ UserAuthGuard ],
		children: [
			{
				path: 'lines', // child route path
				component: LineListingComponent, // child route component that the router renders,
				canActivate: [ UserAuthGuard ]
			},
			{
				path: 'nodes', // child route path
				component: NodeListingComponent, // child route component that the router renders,
				canActivate: [ UserAuthGuard ]
			},

			{
				path: 'paths', // child route path
				component: PathListingComponent, // child route component that the router renders,
				canActivate: [ UserAuthGuard ]
			},
			{
				path: 'vehicleDuties', // child route path
				component: VehicleDutyListingComponent, // child route component that the router renders,				
				canActivate: [ UserAuthGuard ]
			},
			{
				path: 'driverDuties', // child route path
				component: DriverDutyListingComponent, // child route component that the router renders,				
				canActivate: [ UserAuthGuard ]
			}
		]
	},

	{
		path: 'import',
		component: FileImportComponent,
		canActivate: [ AdminAuthGuard ]
	},

	{
		path: 'visualizer',
		component: View2dComponent,
		canActivate: [ UserAuthGuard ]
	},

	{
		path: 'planning',
		component: PlanningComponent,
		canActivate: [ ManagerAuthGuard ]
	},

	{
		path: 'home',
		component: WelcomeComponent
	},
	{
		path: '',
		component: WelcomeComponent
	},
	{
		path: 'register',
		component: UserRegistrationComponent
	},
	{
		path: 'userPanel',
		component: UserPanelComponent,
		canActivate: [ UserAuthGuard ]
	},

	{ path: 'login', component: LoginComponent },
	{ path: 'retrievePassword', component: RetrievePasswordComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
