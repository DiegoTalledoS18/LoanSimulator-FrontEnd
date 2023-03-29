import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalculatorComponent} from "./calculator.component";
import {MatLegacyRadioModule} from "@angular/material/legacy-radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";


const calculatorRoutes: Route[] = [
  {
    path: '',
    component: CalculatorComponent
  }
]

@NgModule({
  declarations: [
    CalculatorComponent,
  ],
  imports: [
    RouterModule.forChild(calculatorRoutes),
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
  ]
})

export class CalculatorModule
{
}
