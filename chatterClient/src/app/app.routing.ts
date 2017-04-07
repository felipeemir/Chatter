import { ModuleWithProviders } from '@angular/core';

import { Routes , RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';


const appRoutes :Routes = [
	{ path : '' , component : LoginComponent},
	{ path : 'home' , component : HomeComponent},
	{ path : 'home/:userid' , component : HomeComponent},
	{ path : '**' , component : NotFoundComponent},
];

export const appRouting :ModuleWithProviders = RouterModule.forRoot(appRoutes);