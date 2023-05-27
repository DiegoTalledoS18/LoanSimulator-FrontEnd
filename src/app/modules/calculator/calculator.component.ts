import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Inject} from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from "@angular/material/datepicker";

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})

export class CustomDatePipe extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
    return super.transform(value, "dd/MM/YY");
  }
}

interface Desgravamen {
  viewValue: string;
}

interface Currency {
  viewValue: string;
}

interface TipeTasa {
  viewValue: string;
}

interface GracePeriod {
  viewValue: string;
}

export interface Cronograma {
  vencimiento: Date;
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
    capital: new FormControl('', [Validators.required, Validators.min(65200), Validators.max(464200)]),
    tipotasa: new FormControl('', [Validators.required]),
    tasa: new FormControl('', [Validators.required, Validators.min(4), Validators.max(49.99)]), //Sujeta a entidad financiera --> CONSULTAR CON EL PROFESOR
    tiempo: new FormControl('', [Validators.required, Validators.min(60), Validators.max(300)]),
    moneda: new FormControl('', [Validators.required]),
  });

  PayFormGroup = new FormGroup({
    diaDePago: new FormControl('', [Validators.required, Validators.min(1), Validators.max(30)]),
    fechaSolicitud: new FormControl(Date, [Validators.required]),
    seguro: new FormControl('', [Validators.required]),
  })

  gracePeriodFormGroup = new FormGroup({
    meses: new FormControl('', [Validators.required,Validators.min(1), Validators.max(parseInt(<string>this.userFormGroup.get('tiempo')?.value))]),
    capitalizacion: new FormControl(false, [Validators.required]),
  })

  bornDatesFormGroup = new FormGroup({
    primerTitular: new FormControl(Date, [Validators.required]),
    segundoTitular: new FormControl(Date, [Validators.required])
  })

  stepper = true;
  gracePeriodWithCapitalization = false;
  calculateSend = false;
  gracePeriod = "Cero";
  panelOpenState = false;
  fecha = "";
  minDate = new Date();
  maxDate = new Date();
  tea = 0;
  tasa_mensual = 0.0;
  cuota = 0;


  desgravamens: Desgravamen[] = [
    {viewValue: 'Sin seguro'},
    {viewValue: 'Convencional individual'},
    {viewValue: 'Convencional mancomunado'},
    {viewValue: 'Con devolución individual'},
    {viewValue: 'Con devolución mancomunado'},
  ];

  currencys: Currency[] = [
    {viewValue: 'Soles'},
    {viewValue: 'Dolares'},
  ];

  tipetasa: TipeTasa[] = [
    {viewValue: 'Tasa Nominal Anual'},
    {viewValue: 'Tasa Efectiva Anual'},
  ];

  GracePeriods: GracePeriod[] = [
    {viewValue: 'Total'},
    {viewValue: 'Parcial'},
  ];

  ELEMENT_DATA: Cronograma[] = []
  displayedColumns: string[] = ['mes', 'vencimiento', 'amortizacion', 'interes', 'cuota', 'saldo', 'comisiones', 'subvencion'];


  constructor(private route: Router, private elementRef: ElementRef, private _adapter: DateAdapter<any>,
              @Inject(MAT_DATE_LOCALE) private _locale: string) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    this.minDate = new Date(currentYear, currentMonth, 1);
    this.maxDate = new Date(currentYear + 5, 1, 15);
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }

  next() {
    if (this.userFormGroup.valid) {
      this.stepper = false;
    }

  }
  calcularVANYTIR(flujosDeCaja: number[], tasaDescuento: number): [number, number] {
    let VAN = 0;
    let TIR = 0;

    // Cálculo del VAN
    for (let i = 0; i < flujosDeCaja.length; i++) {
      VAN += flujosDeCaja[i] / Math.pow(1 + tasaDescuento, i);
    }

    // Cálculo del TIR utilizando el método de aproximaciones sucesivas
    let tasaInicial = 0.1; // Valor inicial para el cálculo del TIR
    let iteracionesMaximas = 100;
    let precision = 0.0001;

    for (let i = 0; i < iteracionesMaximas; i++) {
      let VAN_TIR = 0;

      for (let j = 0; j < flujosDeCaja.length; j++) {
        VAN_TIR += flujosDeCaja[j] / Math.pow(1 + TIR, j);
      }

      if (Math.abs(VAN_TIR) < precision) {
        break;
      }

      TIR += (1 + TIR) * (VAN / VAN_TIR - 1);
    }

    return [VAN, TIR];
  }


  setGracePeriod(gracePeriod: string) {
    this.gracePeriod = gracePeriod;
  }

  simulate() {
    this.calculateTableData();
    if (this.PayFormGroup.valid) {
      if (this.gracePeriod == 'Cero') {
        if (this.PayFormGroup.get('seguro')?.value != 'Sin seguro') {
          if (this.PayFormGroup.get('seguro')?.value == 'Convencional individual' || this.PayFormGroup.get('seguro')?.value == 'Con devolución individual') {
            if (this.bornDatesFormGroup.get('primerTitular')?.valid) {
              //this.calculate()
              this.calculateSend = true;
              //this.route.navigate(['/schedule']);
            }
          }
          if (this.PayFormGroup.get('seguro')?.value == 'Convencional mancomunado' || this.PayFormGroup.get('seguro')?.value == 'Con devolución mancomunado') {
            if (this.bornDatesFormGroup.get('primerTitular')?.valid && this.bornDatesFormGroup.get('segundoTitular')?.valid) {
              //this.calculate()
              //this.route.navigate(['/schedule']);
              this.calculateSend = true;
            }
          }
        } else {
          //this.calculate()
          //this.route.navigate(['/schedule']);
          this.calculateSend = true;
        }
      } else {
        if (this.gracePeriodFormGroup.get('meses')?.valid) {
          if (this.PayFormGroup.get('seguro')?.value != 'Sin seguro') {
            if (this.PayFormGroup.get('seguro')?.value == 'Convencional individual' || this.PayFormGroup.get('seguro')?.value == 'Con devolución individual') {
              if (this.bornDatesFormGroup.get('primerTitular')?.valid) {
                //this.calculate()
                //this.route.navigate(['/schedule']);
                this.calculateSend = true;
              }
            }
            if (this.PayFormGroup.get('seguro')?.value == 'Convencional mancomunado' || this.PayFormGroup.get('seguro')?.value == 'Con devolución mancomunado') {
              if (this.bornDatesFormGroup.get('primerTitular')?.valid && this.bornDatesFormGroup.get('segundoTitular')?.valid) {
                //this.calculate()
                //this.route.navigate(['/schedule']);
                this.calculateSend = true;
              }
            }
          } else {
            //this.calculate()
            //this.route.navigate(['/schedule']);
            this.calculateSend = true;
          }
        }
      }

    }
  }
  calculateTableData() {
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);
    let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
    let tasa: number = <number><unknown>this.userFormGroup.get('tasa')?.value;
    let tipotasa: string = <string>this.userFormGroup.get('tipotasa')?.value;
    let seguro_valor : string = <string>this.PayFormGroup.get('seguro')?.value;
    let cuota : number;

    let meses_gracia: number = parseInt(<string>this.gracePeriodFormGroup.get('meses')?.value);
    let capitalizacion: boolean = <boolean><unknown>this.gracePeriodFormGroup.get('capitalizacion')?.value;
    let date = new Date(this.fecha);
    let seguro: number


    if (tipotasa == 'Tasa Nominal Anual') {
      tasa = tasa/100
      tasa = (1+tasa/360)**(360)-1
    }

    this.tea = tasa
    this.tea = parseFloat(this.tea.toFixed(7))

    this.tasa_mensual = (1 + (tasa / 100)) ** (30/ 360) - 1


    let interes_k: number = 0.0
    let saldo: number = capital
    let amortizacion: number = 0

    //SEGURO IF
    if (seguro_valor == 'Sin seguro') {
      seguro = 0
    } else {
      seguro = 0.004396 * saldo //Porcentaje para el seguro de Desgravamen en el BBVA es 0.04396%
    }
    if(this.gracePeriod == 'Cero'){
      meses_gracia = 0
    }

    

    if(this.gracePeriod == 'Total'){
      for (let i = 0; i < meses_gracia; i++) {

        interes_k = saldo * this.tasa_mensual
        cuota = 0
  
        //amortizacion = cuota - interes_k - seguro
        amortizacion = 0
  
        saldo = parseFloat((saldo + interes_k).toFixed(2))
  
        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat(cuota.toFixed(2)),
            saldo: saldo,
            comisiones: 0.00,
            subvencion: 0.00,
          }
        )
  
        date = new Date(date.setMonth(date.getMonth() + 1));
  
      }
    }

    if(this.gracePeriod == 'Parcial'){
      for (let i = 0; i < meses_gracia; i++) {

        interes_k = saldo * this.tasa_mensual
        
        cuota=interes_k
  
        //amortizacion = cuota - interes_k - seguro
        amortizacion = interes_k-cuota
  
        saldo = parseFloat((saldo + amortizacion).toFixed(2))
  
        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat(cuota.toFixed(2)),
            saldo: saldo,
            comisiones: 0.00,
            subvencion: 0.00,
          }
        )
  
        date = new Date(date.setMonth(date.getMonth() + 1));
  
      }
    }

    let division_d =  ((1 + this.tasa_mensual) ** (mes-meses_gracia)) - 1

    //console.log("Division Down --> ", ((1 + tasa_mensual) ** mes) - 1)

    let division_u = this.tasa_mensual * ((1 + this.tasa_mensual) ** (mes-meses_gracia))

    //console.log("Division Upper --> ", tasa_mensual * ((1 + tasa_mensual) ** mes))

    cuota = saldo * (division_u / division_d)

    //FALTA ACTUALIZAR LA CUOTA -- PREGUNTAR AL PROFESOR


    for (let i = 0; i < mes-meses_gracia; i++) {

      console.log('FOR')

      //amortizacion = cuota - interes_k - seguro
      amortizacion = cuota - interes_k


      interes_k = saldo * this.tasa_mensual
      //amortizacion = this.cuota - interes_k - seguro
      saldo = parseFloat((saldo - amortizacion).toFixed(2))

      this.ELEMENT_DATA?.push(
        {
          mes: meses_gracia + i + 1,
          vencimiento: date,
          amortizacion:  parseFloat(amortizacion.toFixed(2)),
          interes: parseFloat(interes_k.toFixed(2)),
          cuota: parseFloat(cuota.toFixed(2)),
          saldo: saldo,
          comisiones: 0.00,
          subvencion: 0.00,
        }
      )

      date = new Date(date.setMonth(date.getMonth() + 1));

    }

    /////VAN Y TIR///////

    const inversionInicial = capital*-1; // Inversión inicial (monto del préstamo)
    const cuotaMensual = parseFloat(this.cuota.toFixed(2)); // Cuota mensual constante

    // Construir el arreglo de flujos de caja
    const flujosDeCaja = [inversionInicial]; // Primer elemento es la inversión inicial

    // Generar los flujos de caja mensuales
    for (let i = 1; i <= mes; i++) {
      flujosDeCaja.push(cuotaMensual);
    }
    console.log("cuota mensual: "+cuotaMensual)
    console.log("flujosDeCaja: "+flujosDeCaja[0]+" vs "+flujosDeCaja[mes-1]+" tamaño: "+flujosDeCaja.length)
    console.log("TEA: "+this.tea)
    const [VAN, TIR] = this.calcularVANYTIR(flujosDeCaja,this.tea);

    console.log('VAN:', VAN);
    console.log('TIR:', TIR);

    /////////////////////////
  }

  navigateBack() {
    this.route.navigate(['/login']);
  }

  validateNumber(numberString: string, minString: string, maxString: string) {
    let number = parseInt(numberString)
    let min = parseInt(minString)
    let max = parseInt(maxString)
    return number < min || number > max;
  }

  showDate(dp_: MatDatepicker<any>) {
    this.fecha = dp_.datepickerInput.getStartValue().format('MM/DD/YY')
  }

  calculate() {
    console.log("hola")
  }

}
