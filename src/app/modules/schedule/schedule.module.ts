import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatRadioModule} from "@angular/material/radio";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTableModule} from '@angular/material/table';
import {ScheduleComponent} from "./schedule.component";

const scheduleRoutes: Route[] = [
  {
    path: '',
    component: ScheduleComponent
  }
]

@NgModule({
  declarations: [
    ScheduleComponent,
  ],
  imports: [
    RouterModule.forChild(scheduleRoutes),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatProgressBarModule,
    MatTableModule,
  ]
})

export class ScheduleModule
{
}
