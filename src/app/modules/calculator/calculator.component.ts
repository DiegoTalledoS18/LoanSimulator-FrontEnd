import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.services";
import {FormControl, FormGroup, Validators} from "@angular/forms";
interface Desgravamen {
  viewValue: string;
}

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
  });
  stepper=true;
  currency="";
  gracePeriod="";
  gracePeriodWithCapitalization=false;
  selectedValue="";
  calculateSend=false;
  desgravamens: Desgravamen[] = [
    { viewValue: 'Sin seguro'},
    { viewValue: 'Convencional individual'},
    { viewValue: 'Convencional mancomunado'},
    { viewValue: 'Con devolución individual'},
    { viewValue: 'Con devolución mancomunado'},
  ];




  //constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {}

  constructor(private route: Router, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }

  setCurrency(moneda: string){
    this.currency=moneda;
  }
  setGracePeriod(gracePeriod: string){
    this.gracePeriod=gracePeriod;
  }
  next(){
    if(this.userFormGroup.valid && this.currency!="" ) {
    }
    this.stepper=false;
  }
  simulate(){
    this.calculateSend=true;
  }



}
