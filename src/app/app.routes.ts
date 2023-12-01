import { Routes } from '@angular/router';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, title: 'Dynamo Login' },

    { path: 'signup', component: SignupComponent, title: 'Dynamo Signup' },

    { path: 'dashboard', component: DashboardComponent },
    
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' },
];
