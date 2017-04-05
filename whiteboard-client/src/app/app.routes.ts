import { Routes } from '@angular/router';
import { AuthAppComponent, APP_ROUTES } from "./auth-app/auth-app.component";

export const ROUTES: Routes = [
  { path: '', component: AuthAppComponent, children: APP_ROUTES },
  //{ path: '**',    component: },
];
