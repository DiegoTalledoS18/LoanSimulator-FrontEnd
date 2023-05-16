import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Inject} from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from "@angular/material/datepicker";

interface Desgravamen {
  viewValue: string;
}

interface Currency {
  viewValue: string;
}

interface GracePeriod {
  viewValue: string;
}

export interface Cronograma {
  vencimiento: string;
  mes: number;
  amortizacion: number;
  interes: number;
  comisiones: number;
  subvencion: number;
  cuota: number;
  saldo: number;
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-PE'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class CalculatorComponent implements AfterViewInit {

  userFormGroup = new FormGroup({
    capital: new FormControl('',[Validators.required,Validators.min(11000),Validators.max(99999999999.99)]),
    tasa: new FormControl('',[Validators.required,Validators.min(10),Validators.max(24.99)]),
    tiempo: new FormControl('',[Validators.required,Validators.min(1),Validators.max(60)]),
    moneda: new FormControl('',[Validators.required]),
  });

  PayFormGroup=new FormGroup({
    diaDePago: new FormControl('',[Validators.required,Validators.min(1),Validators.max(31)]),
    fechaSolicitud: new FormControl(Date,[Validators.required]),
    seguro: new FormControl('',[Validators.required]),
  })

  gracePeriodFormGroup=new FormGroup({
    meses: new FormControl('',[Validators.required,Validators.min(1)]),
    capitalizacion: new FormControl(false,[Validators.required]),
  })

  bornDatesFormGroup=new FormGroup({
    primerTitular: new FormControl(Date,[Validators.required]),
    segundoTitular: new FormControl(Date,[Validators.required])
  })

  stepper=true;
  gracePeriodWithCapitalization=false;
  calculateSend=false;
  gracePeriod="Cero";
  panelOpenState = false;

  desgravamens: Desgravamen[] = [
    { viewValue: 'Sin seguro'},
    { viewValue: 'Convencional individual'},
    { viewValue: 'Convencional mancomunado'},
    { viewValue: 'Con devolución individual'},
    { viewValue: 'Con devolución mancomunado'},
  ];

  currencys: Currency[] = [
    { viewValue: 'Soles'},
    { viewValue: 'Dolares'},
  ];

  GracePeriods: GracePeriod[] = [
    { viewValue: 'Total'},
    { viewValue: 'Parcial'},
  ];

  ELEMENT_DATA: Cronograma[]=[]
  displayedColumns: string[] = ['mes','vencimiento','amortizacion','interes','comisiones','subvencion','cuota','saldo'];


  constructor(private route: Router, private elementRef: ElementRef,private _adapter: DateAdapter<any>,
              @Inject(MAT_DATE_LOCALE) private _locale: string) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }
  next(){
    if(this.userFormGroup.valid) {
      this.stepper=false;
    }

  }
  setGracePeriod(gracePeriod: string){
    this.gracePeriod=gracePeriod;
  }
  simulate(){
    if(this.PayFormGroup.valid){
      if(this.gracePeriod=='Cero'){
        if(this.PayFormGroup.get('seguro')?.value!='Sin seguro'){
          if(this.PayFormGroup.get('seguro')?.value=='Convencional individual' ||this.PayFormGroup.get('seguro')?.value=='Con devolución individual'){
            if(this.bornDatesFormGroup.get('primerTitular')?.valid){
              this.calculate()
              //this.route.navigate(['/schedule']);
            }
          }
          if(this.PayFormGroup.get('seguro')?.value=='Convencional mancomunado' ||this.PayFormGroup.get('seguro')?.value=='Con devolución mancomunado'){
            if(this.bornDatesFormGroup.get('primerTitular')?.valid && this.bornDatesFormGroup.get('segundoTitular')?.valid){
              this.calculate()
              //this.route.navigate(['/schedule']);
            }
          }
        }
        else {
          this.calculate()
          //this.route.navigate(['/schedule']);
        }
      }
      else {
        if(this.gracePeriodFormGroup.get('meses')?.valid){
          if(this.PayFormGroup.get('seguro')?.value!='Sin seguro'){
            if(this.PayFormGroup.get('seguro')?.value=='Convencional individual' ||this.PayFormGroup.get('seguro')?.value=='Con devolución individual'){
              if(this.bornDatesFormGroup.get('primerTitular')?.valid){
                this.calculate()
                //this.route.navigate(['/schedule']);
              }
            }
            if(this.PayFormGroup.get('seguro')?.value=='Convencional mancomunado' ||this.PayFormGroup.get('seguro')?.value=='Con devolución mancomunado'){
              if(this.bornDatesFormGroup.get('primerTitular')?.valid && this.bornDatesFormGroup.get('segundoTitular')?.valid){
                this.calculate()
                //this.route.navigate(['/schedule']);
              }
            }
          }
          else {
            this.calculate()
            //this.route.navigate(['/schedule']);
          }
        }
      }

    }
  }
  calculateTableData(){
    this.ELEMENT_DATA?.push({mes: 1,vencimiento: 'fecha',amortizacion:0,interes:0,comisiones:0,subvencion:0,cuota:0,saldo:0})
  }
  navigateBack(){
    this.route.navigate(['/login']);
  }

  validateNumber(numberString: string,minString: string,maxString: string){
    let number=parseInt(numberString)
    let min=parseInt(minString)
    let max=parseInt(maxString)
    return number < min || number > max;

  }

  showDate(dp_: MatDatepicker<any>){
    console.log(dp_.datepickerInput.getStartValue().format('DD-MM-YYYY'))
  }

  calculate(){



  }

}
