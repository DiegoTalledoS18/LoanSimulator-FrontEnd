import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.services";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements AfterViewInit {

  userFormGroup = new FormGroup({
    capital: new FormControl('',[Validators.required]),
    tasa: new FormControl('',[Validators.required]),
    tiempo: new FormControl('',[Validators.required]),
    moneda: new FormControl('',[Validators.required])
  });

  //constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {}

  constructor(private route: Router, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }

}
