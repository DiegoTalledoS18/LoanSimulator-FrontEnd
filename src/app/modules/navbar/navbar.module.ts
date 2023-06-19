import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarComponent} from "./navbar.component";
import {MatLegacyRadioModule} from "@angular/material/legacy-radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from "@angular/material/grid-list";
import {CalculatorComponent} from "../calculator/calculator.component";
import {LoginComponent} from "../login/login.component";
import {SchedulesComponent} from "../schedules/schedules.component";

const navbarRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent
  },
  { path: 'simulate', loadChildren: () => import('src/app/modules/calculator/calculator.module').then(m => m.CalculatorModule)},
  { path: 'schedules', loadChildren: () => import('src/app/modules/schedules/schedule.module').then(m => m.ScheduleModule) },
]

@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    RouterModule.forChild(navbarRoutes),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatLegacyRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
  ]
})

export class NavbarModule
{
}
