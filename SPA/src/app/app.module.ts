import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './core/header/header.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { NodeRegistrationComponent } from './registrations/node-registration/node-registration.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LineRegistrationComponent } from './registrations/line-registration/line-registration.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { DriverTypeRegistrationComponent } from './registrations/driver-type-registration/driver-type-registration.component';
import { PathRegistrationComponent } from './registrations/path-registration/path-registration.component';
import { MatTableModule } from '@angular/material/table';
import { FileImportComponent } from './import/fileimport.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { VehicleTypeRegistrationComponent } from './registrations/vehicle-type-registration/vehicle-type-registration.component';
import { View2dComponent } from './view2d/view2d.component';
import { PlanningComponent } from './planning/planning.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VehicleRegistrationComponent } from './registrations/vehicle-registration/vehicle-registration.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/services/authentication-actions/tokenInterceptor.service';
import { UserRegistrationComponent } from './registrations/user-registration/user-registration.component';
import { DriverDutyRegistrationComponent } from './registrations/driver-duty-registration/driver-duty-registration.component';
import { TripRegistrationComponent } from './registrations/trip-registration/trip-registration.component';
import { RetrievePasswordComponent } from './retrieve-password/retrieve-password.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DriverRegistrationComponent } from './registrations/driver-registration/driver-registration.component';
import { VehicleDutyRegistrationComponent } from './registrations/vehicle-duty-registration/vehicle-duty-registration.component';
import { WorkblockRegistrationComponent } from './registrations/workblock-registration/workblock-registration.component';
import { LineListingComponent } from './listings/line-listing/line-listing.component';
import { ListingsComponent } from './listings/listings.component';
import { MatSortModule } from '@angular/material/sort';
import { PathListingComponent } from './listings/path-listing/path-listing.component';
import { NodeListingComponent } from './listings/node-listings/node-listing.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDetailRowDirective } from './listings/path-listing/cdk-detail-row.directive';
import { VehicleDutyListingComponent } from './listings/vehicle-duty-listing/vehicle-duty-listing.component';

 
import { UserPanelComponent } from './user-panel/user-panel.component';
import { DriverDutyListingComponent } from './listings/driver-duty-listing/driver-duty-listing.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		View2dComponent,
		RegistrationsComponent,
		NodeRegistrationComponent,
		WelcomeComponent,

		LineRegistrationComponent,

		DriverTypeRegistrationComponent,

		PathRegistrationComponent,
		FileImportComponent,
		VehicleTypeRegistrationComponent,
		View2dComponent,
		PlanningComponent,
		VehicleRegistrationComponent,
		LoginComponent,
		UserRegistrationComponent,
		DriverDutyRegistrationComponent,
		DriverRegistrationComponent,
		TripRegistrationComponent,
		RetrievePasswordComponent,
		VehicleDutyRegistrationComponent,
		WorkblockRegistrationComponent,
		LineListingComponent,
		NodeListingComponent,
		ListingsComponent,
		PathListingComponent,
		CdkDetailRowDirective,
		VehicleDutyListingComponent,
		UserPanelComponent,
		DriverDutyListingComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ColorPickerModule,
		MatSelectModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatGridListModule,
		MatListModule,
		MatSlideToggleModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		NgxMaterialTimepickerModule.setLocale('en-EN'),
		MatSortModule,
		MatDialogModule,
		MatDividerModule,

		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,

		MatNativeDateModule,
		MatPaginatorModule,

		MatRippleModule,
		MatSelectModule,

		MatSlideToggleModule,

		MatSortModule,
		MatTableModule,

		MatTooltipModule
	],
	bootstrap: [ AppComponent ],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	]
})
export class AppModule {}
