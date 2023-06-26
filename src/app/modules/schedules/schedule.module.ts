import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SchedulesComponent} from "./schedules.component";
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
import {MatToolbarModule} from "@angular/material/toolbar";
import {Component} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';


const scheduleComponent: Route[] = [
  {
    path: '',
    component: SchedulesComponent
  }
]

@NgModule({
  declarations: [
    SchedulesComponent,
  ],
  imports: [
    RouterModule.forChild(scheduleComponent),
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
    MatToolbarModule,
    MatListModule,
    MatDividerModule
  ],

  exports: [
  ]
})

export class ScheduleModule
{
}
