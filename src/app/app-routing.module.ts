import {Route} from "@angular/router";
import {ScheduleModule} from "./modules/schedules/schedule.module";

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('src/app/modules/login/login.module').then(m => m.LoginModule)},
  { path: 'register', loadChildren: () => import('src/app/modules/register/register.module').then(m => m.RegisterModule)},

  {
    path: 'calculator',
    children: [
      {
        path: '',
        redirectTo: 'simulate',
        pathMatch: 'full',
      },
      { path: 'simulate', loadChildren: () => import('src/app/modules/calculator/calculator.module').then(m => m.CalculatorModule)},
      { path: 'schedules', loadChildren: () => import('src/app/modules/schedules/schedule.module').then(m => m.ScheduleModule) },
    ],
  },

  //{ path: 'schedule', loadChildren: () => import('src/app/modules/schedule/schedule.module').then(m => m.ScheduleModule)}
];
