import {Route} from "@angular/router";

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('src/app/modules/login/login.module').then(m => m.LoginModule)},
  { path: 'register', loadChildren: () => import('src/app/modules/register/register.module').then(m => m.RegisterModule)},
];
