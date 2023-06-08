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
import { ToastrService } from 'ngx-toastr';

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

interface Compensatorio {
  name: string;
  value: number;
}

interface Gastos {
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
    cuotaInicial: new FormControl('', [Validators.required, this.cuotaInicialValidator]),
    tipotasa: new FormControl('', [Validators.required]),
    tasa: new FormControl('', [Validators.required, Validators.min(4), Validators.max(49.99)]),
    tiempo: new FormControl('', [Validators.required, Validators.min(60), Validators.max(300)]),
    moneda: new FormControl('', [Validators.required]),
  });

  PayFormGroup = new FormGroup({
    diaDePago: new FormControl('', [Validators.required, Validators.min(1), Validators.max(30)]),
    fechaSolicitud: new FormControl(Date, [Validators.required]),
    seguro: new FormControl('', [Validators.required]),
  })

  CompensatoryTasaGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(87.91)]),//segun el BCR
  })
  CompensatoryComisionGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatorySeguroGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryAdministracionGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryFormalizacionGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryAdicionalGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryRetencionGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
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
  compensatory="Comision";
  category="Gastos";
  panelOpenState = false;
  fecha = "";
  minDate = new Date();
  maxDate = new Date();
  tea = 0;
  tasa_mensual = 0.0;
  cuota = 0;
  VAN="";
  TIR="";
  flag = false;
  compensatoryTasaArray:Compensatorio[]=[]
  compensatoryComisionArray:Compensatorio[]=[]
  compensatoryRetencionArray:Compensatorio[]=[]
  foods: Gastos[] = [
    {viewValue: 'Gastos administrativos'},
    {viewValue: 'Comisiones'},
    {viewValue: 'Seguros'},
    {viewValue: 'Gastos de formalización'},
    {viewValue: 'Otros costos adicionales'},
  ];


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

    const mesesControl = this.gracePeriodFormGroup.get('meses');

    // Agregar validador personalizado a mesesControl
    // @ts-ignore
    mesesControl?.setValidators(this.periodoGraciaValidator.bind(this));
  }

  cuotaInicialValidator(control: AbstractControl): { [key: string]: any } | null {
    const capital = +control.parent?.get('capital')?.value;
    const cuotaInicial = +control.value;

    if (cuotaInicial <= capital * 0.075) {
      return { 'cuotaInicialInvalida': true };
    }

    return null;
  }

  periodoGraciaValidator(control: FormControl): { [key: string]: any } | null {
    // @ts-ignore
    const duracionPrestamo = +this.userFormGroup.get('tiempo')?.value;
    const mesesPeriodoGracia = +control.value;

    if (mesesPeriodoGracia > duracionPrestamo) {
      return { 'periodoGraciaInvalido': true };
    }

    return null;
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }

  next() {
    if (this.userFormGroup.valid) {
      this.stepper = false;
      this.stepper = false;
      this.addTNM()
      this.setGastosList()
    }
    /*this.stepper = false;
    this.addTNM()
    this.setGastosList()*/


  }
  calculateTNM(){
    let tasa: number = <number><unknown>this.userFormGroup.get('tasa')?.value;
    let tipotasa: string = <string>this.userFormGroup.get('tipotasa')?.value;
    if (tipotasa == 'Tasa Nominal Anual') {
      tasa = tasa/100
      tasa = (1+tasa/360)**(360)-1
    }

    //Calculo de la Tasa Mensual
    let tasaMensual = (1 + (tasa / 100)) ** (30/ 360) - 1
    return tasaMensual
  }
  addTNM(){
    let newTasa: Compensatorio = {
      name: "Tasa Nominal Mensual",
      value: this.calculateTNM()*100
    };
    this.compensatoryTasaArray.push(newTasa);
  }
  setGastosList(){

  }
  deleteInterestArrayByName(nombre: string) {
    this.compensatoryTasaArray = this.compensatoryTasaArray.filter(item => item.name !== nombre);
  }
  deleteComisonArrayByName(nombre: string) {
    this.compensatoryComisionArray = this.compensatoryComisionArray.filter(item => item.name !== nombre);
  }
  deleteRetencionArrayByName(nombre: string) {
    this.compensatoryRetencionArray = this.compensatoryRetencionArray.filter(item => item.name !== nombre);
  }

  addCompensatory(){
    if(this.category=="Tasa"){
      if (this.CompensatoryTasaGroup.valid) {
        let name = this.CompensatoryTasaGroup.get('nombre')?.value ?? "";
        let valueString = this.CompensatoryTasaGroup.get('valor')?.value;
        let value = parseFloat(valueString ?? '0');
        let newTasa: Compensatorio = {
          name: name as string,
          value: value as number
        };
        if (!this.compensatoryTasaArray.some(item => item.name === newTasa.name)) {
          this.compensatoryTasaArray.push(newTasa);
        } else {
          console.log("El nombre ya existe en el array.");
        }
        this.CompensatoryTasaGroup.get('nombre')?.setValue("");
        this.CompensatoryTasaGroup.get('valor')?.setValue("");
      }

    }
    if(this.category=="Retencion") {
      if (this.CompensatoryRetencionGroup.valid) {
        let name = this.CompensatoryRetencionGroup.get('nombre')?.value ?? "";
        let valueString = this.CompensatoryRetencionGroup.get('valor')?.value;
        let value = parseFloat(valueString ?? '0');
        let newRetencion: Compensatorio = {
          name: name as string,
          value: value as number
        };
        if (!this.compensatoryRetencionArray.some(item => item.name === newRetencion.name)) {
          this.compensatoryRetencionArray.push(newRetencion);
        } else {
          console.log("El nombre ya existe en el array.");
        }
        this.CompensatoryRetencionGroup.get('nombre')?.setValue("");
        this.CompensatoryRetencionGroup.get('valor')?.setValue("");
      }
    }
  }
  calcularVAN(flujosDeCaja: number[], tasaDescuento: number){
    let VAN = 0;

    for (let i = 0; i < flujosDeCaja.length; i++) {
      VAN += flujosDeCaja[i] / Math.pow((1 + tasaDescuento), i);
      //console.log(flujosDeCaja[i]+"/(1+"+tasaDescuento+")^"+i+"= "+flujosDeCaja[i] / Math.pow(1 + tasaDescuento, i))
      //console.log("van= "+VAN)
    }

    return VAN;
  }

  calcularTIRIncrementalMejorado(flujosDeCaja: number[]) {
    const maxIteraciones = 10000; // Número máximo de iteraciones
    const precision = 0.00001; // Precisión para la aproximación de la TIR

    let TIR = 0;
    let TIRPrevio = 0;

    for (let iteracion = 0; iteracion < maxIteraciones; iteracion++) {
      let VAN = 0;
      let derivadaVAN = 0;

      for (let i = 0; i < flujosDeCaja.length; i++) {
        VAN += flujosDeCaja[i] / Math.pow(1 + TIR, i);
        derivadaVAN -= i * flujosDeCaja[i] / Math.pow(1 + TIR, i + 1);
      }

      if (Math.abs(VAN) < precision) {
        // Se encontró una aproximación suficientemente cercana
        return TIR;
      }

      // Ajustar la tasa de descuento para la próxima iteración
      const ajuste = VAN / derivadaVAN;
      TIRPrevio = TIR;
      TIR -= ajuste;
    }

    // No se encontró una solución dentro del número máximo de iteraciones
    return 0;
  }



  setGracePeriod(gracePeriod: string) {
    this.gracePeriod = gracePeriod;
  }

  setInputCompensatory(inputCompensatory: string) {
    this.compensatory = inputCompensatory;
  }
  setInputCategory(inputCategory: string) {
    this.category = inputCategory;
  }
  calculateTCEA(){
    if(this.compensatoryTasaArray.length!=0){
      this.calculateValorRecibido()
    }
  }
  calculateValorRecibido(){
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);
    console.log("mes: "+mes)
    let mesToDia=mes*30
    const searchTerm = ["tnm", "nominal mensual", "tasa nominal mensual"];
    const foundTasa = this.compensatoryTasaArray.find(tasa => searchTerm.some(term => tasa.name.toLowerCase().includes(term)));
    let TNM: number | undefined;
    if (foundTasa) {
      TNM = foundTasa.value/100;
      console.log("TNM: "+TNM)

      let TEC= ((1 + TNM / 30) ** 120)- 1;//remplazar 120 por mesToDia
      console.log("tec: "+TEC)

      let TasaDiariaEquivalente=TEC / (1 + TEC)
      console.log("tasa diaria Equ: "+TasaDiariaEquivalente)

      let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
      let descuento=TasaDiariaEquivalente*98150//remplazar por capital
      console.log("descuento: "+descuento)

      let valorNetoRecibidoALFDP=98150-descuento//remplazar 98150 por capital
      console.log("valorNetoRecibidoALFDP: "+valorNetoRecibidoALFDP)

      let valorNetoRecibido=valorNetoRecibidoALFDP



    } else {
      console.log("Tasa Nominal Mensual no encontrada");
    }

// Hacer uso de la variable 'value' en el resto del código



  }

  simulate() {
    this.calculateTCEA()
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#ffffff';

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
    //let cuotaInicial: number = <number><unknown>this.userFormGroup.get('cuotaInicial')?.value;
    let tasa: number = <number><unknown>this.userFormGroup.get('tasa')?.value;
    let tipotasa: string = <string>this.userFormGroup.get('tipotasa')?.value;
    let seguro_valor : string = <string>this.PayFormGroup.get('seguro')?.value;
    let cuota : number;

    let meses_gracia: number = parseInt(<string>this.gracePeriodFormGroup.get('meses')?.value);
    let date = new Date(this.fecha);
    let seguro: number

    //Conversion de Tasa Nomina a Tasa Efectiva
    if (tipotasa == 'Tasa Nominal Anual') {
      tasa = tasa/100
      tasa = (1+tasa/360)**(360)-1
    }

    this.tea = tasa
    this.tea = parseFloat(this.tea.toFixed(7))

    //Calculo de la Tasa Mensual
    this.tasa_mensual = (1 + (tasa / 100)) ** (30/ 360) - 1

    let interes_k: number = 0.0
    let saldo: number = capital
    let amortizacion: number = 0

    //Calculo del Seguro de desgravamen
    if (seguro_valor == 'Sin seguro') {
      seguro = 0
    } else {
      seguro = 0.004396 * saldo //Porcentaje para el seguro de Desgravamen en el BBVA es 0.04396%
    }

    //Calculo del periodo de gracia
    if(this.gracePeriod == 'Cero'){
      meses_gracia = 0
    }

    if(this.gracePeriod == 'Total'){
      for (let i = 0; i < meses_gracia; i++) {

        interes_k = saldo * this.tasa_mensual
        cuota = 0
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
        cuota = interes_k
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

    this.cuota = cuota

    for (let i = 0; i < mes-meses_gracia; i++) {

      //console.log('FOR')

      interes_k = saldo * this.tasa_mensual

      //amortizacion = cuota - interes_k - seguro
      amortizacion = cuota - interes_k

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

    //Calculo de VAN y TIR

    const inversionInicial = capital*-1; // Inversión inicial (monto del préstamo)
    const cuotaMensual = parseFloat(cuota.toFixed(2)); // Cuota mensual constante

    // Construir el arreglo de flujos de caja
    const flujosDeCaja = [inversionInicial]; // Primer elemento es la inversión inicial

    // Generar los flujos de caja mensuales
    for (let i = 1; i <= mes; i++) {
      flujosDeCaja.push(cuotaMensual);
    }

    console.log("Cuota Mensual: "+cuotaMensual)
    console.log("TEA: "+(this.tea/100))
    const VAN_ = this.calcularVAN(flujosDeCaja,this.tea/100);
    const TIR_ = this.calcularTIRIncrementalMejorado(flujosDeCaja)
    this.TIR = (TIR_ * 100).toFixed(2) + "%";
    this.VAN= VAN_.toFixed(2);


    console.log('VAN:', VAN_);
    console.log('TIR:', TIR_);
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
