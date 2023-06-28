import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Inject} from '@angular/core';
import {SaveDialogComponent} from "./save-dialog/save-dialog.component";


import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from "@angular/material/datepicker";

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import {ScheduleService} from "../../services/schedule.services";
import {Schedule} from "../../models/schedule";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {DialogComponent} from "../schedules/dialog/dialog.component";

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
  seguro: number;
  cuota: number;
  saldo: number;
  flujo: number;
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

  //Form Group Declarations
  userFormGroup = new FormGroup({
    capital: new FormControl('', [Validators.required, Validators.min(65200), Validators.max(464200)]),
    cuotaInicial: new FormControl('', [Validators.required, this.cuotaInicialValidator, this.cuotaInicialValidatorMax]),
    tipotasa: new FormControl('', [Validators.required]),
    tasa: new FormControl('', [Validators.required, Validators.min(4), Validators.max(49.99)]),
    tiempo: new FormControl('', [Validators.required, Validators.min(60), Validators.max(300)]),
    moneda: new FormControl('', [Validators.required]),
  });
  PayFormGroup = new FormGroup({
    diaDePago: new FormControl('', [Validators.required, Validators.min(1), Validators.max(30)]),
    fechaSolicitud: new FormControl(Date, [Validators.required]),
    seguro: new FormControl('', [Validators.required]),
    seguro_riesgo: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
  })
  COKGroup = new FormGroup({
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
  })
  CompensatoryTasaGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(87.91)]),//segun el BCR
  })
  CompensatoryComisionGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatorySeguroGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
  })
  CompensatoryPenalidadGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10)]),//No mayor al 10%
  })
  CompensatoryPortesGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryAdministracionGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryFormalizacionGroup = new FormGroup({
    nombre: new FormControl(''),
    valor: new FormControl('', [Validators.required, Validators.min(0)]),
  })
  CompensatoryAdicionalGroup = new FormGroup({
    nombre: new FormControl(''),
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

  //Boolean Declarations
  stepper = true;
  gracePeriodWithCapitalization = false;
  calculateSend = false;
  panelOpenState = false;
  flag = false;
  bonoBuenPagador=false

  //String Declarations
  gracePeriod = "Cero";
  compensatory = "Comision";
  category = "Gastos";
  fecha = "";
  VAN = "";
  displayableCapital= "";

  //Date Declarations
  minDate = new Date();
  maxDate = new Date();
  minDate_m = new Date();
  maxDate_m = new Date();

  //Int Declarations
  tea = 0;
  tasa_mensual = 0.0;
  tasa_mensual_cuota = 0.0;
  cuota = 0;
  TCEA = 0;
  TIR = 0.0;
  interesesCompensatorios = 0;
  montoFinal = 0.0;
  seguro_desgravamen = 0.0;
  idUser = 0;
  comisiones = 0;
  valor_seguro = 0.0;

  //Array Declarations
  compensatoryTasaArray: Compensatorio[] = []
  compensatoryComisionArray: Compensatorio[] = []
  compensatoryPenalidadArray: Compensatorio[] = []
  compensatoryPortesArray: Compensatorio[] = []
  compensatoryAdministrativosArray: Compensatorio[] = []
  compensatorySegurosArray: Compensatorio[] = []
  compensatoryOtrosArray: Compensatorio[] = []
  compensatoryFormalizacionArray: Compensatorio[] = []
  compensatoryRetencionArray: Compensatorio[] = []

  sendData: Schedule[];

  gastos: Gastos[] = [
    {viewValue: 'Gastos administrativos'},
    {viewValue: 'Comisiones'},
    {viewValue: 'Penalidad'},
    {viewValue: 'Portes'},
    {viewValue: 'Gastos de formalización'},
    {viewValue: 'Otros costos adicionales'},
  ];

  desgravamens: Desgravamen[] = [
    {viewValue: 'Sin seguro'},
    {viewValue: 'Convencional individual'},
    {viewValue: 'Convencional mancomunado'},
    //{viewValue: 'Con devolución individual'},
    //{viewValue: 'Con devolución mancomunado'},
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

  selectedGasto: string = 'Gastos administrativos';

  //Table Data
  ELEMENT_DATA: Cronograma[] = []
  displayedColumns: string[] = ['mes', 'vencimiento', 'amortizacion', 'interes', 'cuota', 'saldo', 'comisiones', 'seguro', 'flujo'];


  constructor(private route: Router, private elementRef: ElementRef, private _adapter: DateAdapter<any>,
              @Inject(MAT_DATE_LOCALE) private _locale: string, private scheduleService: ScheduleService, public dialog: MatDialog) {

    this.sendData = [] as Schedule[];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    console.log(currentYear - 18, "/", 12, "/", 31)

    this.minDate = new Date(currentYear, currentMonth, currentDate);
    this.maxDate = new Date(currentYear + 5, 1, 15);

    this.maxDate_m = new Date(currentYear - 18, 11, 31);
    //this.maxDate_m = new Date(currentYear, currentMonth, currentDate);

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

  cuotaInicialValidatorMax(control: AbstractControl): { [key: string]: any } | null {
    const capital = +control.parent?.get('capital')?.value;
    const cuotaInicial = +control.value;

    if (cuotaInicial > capital) {
      return { 'cuotaInicialInvalidaMax': true };
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
      //this.setGastosList()
    }


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

  onGastoSelectionChange(event: any) {
    this.selectedGasto = event.value;
  }

  addTNM(){
    let newTasa: Compensatorio = {
      name: "Tasa Nominal Mensual",
      value: this.calculateTNM()*100
    };
    if(this.compensatoryTasaArray.length==0){
      this.compensatoryTasaArray.push(newTasa);
    }
  }

  deleteArrayElementByName(nombre: string,gastoType: string) {
    if(this.category=="Tasas"){
      const shouldDelete = confirm('¿Estás seguro que deseas borrar la tasa compensatoria establecida?\n ' +
        'Esto podria afectar seriamente los calculos en la simulacion.');
      if (shouldDelete) {
        this.compensatoryTasaArray = this.compensatoryTasaArray.filter(item => item.name !== nombre);
      } else {
        return
      }
    }
    if(this.category=="Retencion") {
      this.compensatoryRetencionArray = this.compensatoryRetencionArray.filter(item => item.name !== nombre);
    }
    if(this.category=="Gastos"){
      if(gastoType=="Gastos administrativos"){
        this.compensatoryAdministrativosArray = this.compensatoryAdministrativosArray.filter(item => item.name !== nombre);
      }
      if(gastoType=="Comisiones"){
        this.compensatoryComisionArray = this.compensatoryComisionArray.filter(item => item.name !== nombre);
      }
      if(gastoType=="Penalidad"){
        this.compensatoryPenalidadArray = this.compensatoryPenalidadArray.filter(item => item.name !== nombre);
      }
      if(gastoType=="Portes"){
        this.compensatoryPortesArray = this.compensatoryPortesArray.filter(item => item.name !== nombre);
      }
      if(gastoType=="Gastos de formalización"){
        this.compensatoryFormalizacionArray = this.compensatoryFormalizacionArray.filter(item => item.name !== nombre);
      }
      if(gastoType=="Otros costos adicionales"){
        this.compensatoryOtrosArray = this.compensatoryOtrosArray.filter(item => item.name !== nombre);
      }
    }
  }

  addCompensatory(){
    if(this.category=="Tasas"){
      if (this.CompensatoryTasaGroup.valid) {
        let name = String(this.compensatoryTasaArray.length + 1);
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
        let name = String(this.compensatoryRetencionArray.length + 1);
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
    if(this.category=="Gastos"){
      if(this.selectedGasto=="Gastos administrativos"){
        if (this.CompensatoryAdministracionGroup.valid) {
          let name = String(this.compensatoryAdministrativosArray.length + 1);
          let valueString = this.CompensatoryAdministracionGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newAdministracion: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryAdministrativosArray.some(item => item.name === newAdministracion.name)) {
            this.compensatoryAdministrativosArray.push(newAdministracion);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryAdministracionGroup.get('nombre')?.setValue("");
          this.CompensatoryAdministracionGroup.get('valor')?.setValue("");
        }
      }
      if(this.selectedGasto=="Comisiones"){
        if (this.CompensatoryComisionGroup.valid) {
          let name = String(this.compensatoryComisionArray.length + 1);
          let valueString = this.CompensatoryComisionGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newComision: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryComisionArray.some(item => item.name === newComision.name)) {
            this.compensatoryComisionArray.push(newComision);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryComisionGroup.get('nombre')?.setValue("");
          this.CompensatoryComisionGroup.get('valor')?.setValue("");
        }
      }
      if(this.selectedGasto=="Penalidad"){
        if (this.CompensatoryPenalidadGroup.valid) {
          let name = String(this.compensatoryPenalidadArray.length + 1);
          let valueString = this.CompensatoryPenalidadGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newPenal: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryPenalidadArray.some(item => item.name === newPenal.name)) {
            this.compensatoryPenalidadArray.push(newPenal);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryPenalidadGroup.get('nombre')?.setValue("");
          this.CompensatoryPenalidadGroup.get('valor')?.setValue("");
        }

      }
      if(this.selectedGasto=="Portes"){
        if (this.CompensatoryPortesGroup.valid) {
          let name = String(this.compensatoryPortesArray.length + 1);
          let valueString = this.CompensatoryPortesGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newPenal: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryPortesArray.some(item => item.name === newPenal.name)) {
            this.compensatoryPortesArray.push(newPenal);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryPortesGroup.get('nombre')?.setValue("");
          this.CompensatoryPortesGroup.get('valor')?.setValue("");
        }

      }
      if(this.selectedGasto=="Gastos de formalización"){
        if (this.CompensatoryFormalizacionGroup.valid) {
          let name = String(this.compensatoryFormalizacionArray.length + 1);
          let valueString = this.CompensatoryFormalizacionGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newFormalizacion: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryFormalizacionArray.some(item => item.name === newFormalizacion.name)) {
            this.compensatoryFormalizacionArray.push(newFormalizacion);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryFormalizacionGroup.get('nombre')?.setValue("");
          this.CompensatoryFormalizacionGroup.get('valor')?.setValue("");
        }
      }
      if(this.selectedGasto=="Otros costos adicionales"){
        if (this.CompensatoryAdicionalGroup.valid) {
          let name = String(this.compensatoryOtrosArray.length + 1);
          let valueString = this.CompensatoryAdicionalGroup.get('valor')?.value;
          let value = parseFloat(valueString ?? '0');
          let newAdicional: Compensatorio = {
            name: name as string,
            value: value as number
          };
          if (!this.compensatoryOtrosArray.some(item => item.name === newAdicional.name)) {
            this.compensatoryOtrosArray.push(newAdicional);
          } else {
            console.log("El nombre ya existe en el array.");
          }
          this.CompensatoryAdicionalGroup.get('nombre')?.setValue("");
          this.CompensatoryAdicionalGroup.get('valor')?.setValue("");
        }
      }
    }
  }

  calcularVAN(flujosDeCaja: number[], tasaDescuento: number){

    console.log("COKI: ",tasaDescuento)

    let VAN = 0;

    for (let i = 0; i < flujosDeCaja.length; i++) {
      VAN += flujosDeCaja[i] / Math.pow((1 + tasaDescuento), i);
    }

    return VAN * - 1;
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

  setInputCategory(inputCategory: string) {
    this.category = inputCategory;
  }

  calculateTCEA(tir: number){
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);

    if(this.compensatoryTasaArray.length!=0){

      this.TCEA = Math.pow(Number((1 + tir)), (360 / 30)) - 1;

      console.log("TCEA: "+ this.TCEA)

    } else {
      console.log("Tasa Nominal No establecida")
    }
  }

  calculateInteresesCompensatorios(){
    let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
    const searchTerm = ["tasa","compensatoria","tnm", "nominal mensual", "tasa nominal mensual"];
    const foundTasa = this.compensatoryTasaArray.find(tasa => searchTerm.some(term => tasa.name.toLowerCase().includes(term)));
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);
    let mesToDia=mes*30
    let TNM: number | undefined;
    if(foundTasa){
      TNM = foundTasa.value/100;
      const valorNominalPagare: number = capital
      const tasaNominalMensual: number = TNM;
      const plazoEnDias: number = mesToDia;
      this.interesesCompensatorios= valorNominalPagare * ((1 + tasaNominalMensual / 30) ** plazoEnDias - 1);
    } else {
      this.interesesCompensatorios=0
    }
  }

  calculateValorRecibido(){
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);
    let mesToDia=mes*30
    const searchTerm = ["tasa","compensatoria","tnm", "nominal mensual", "tasa nominal mensual"];
    const foundTasa = this.compensatoryTasaArray.find(tasa => searchTerm.some(term => tasa.name.toLowerCase().includes(term)));
    let TNM: number | undefined;
    if (foundTasa) {
      TNM = foundTasa.value/100;

      let TEC= ((1 + TNM / 30) ** mesToDia)- 1;

      let TasaDiariaEquivalente=TEC / (1 + TEC)

      let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value; //REVISAR CON EL PROFE
      let descuento=TasaDiariaEquivalente*capital

      let valorNetoRecibidoALFDP = capital-descuento

      //Le restamos tod0 menos los gastos administrativos y portes
      let valorNetoRecibido=valorNetoRecibidoALFDP
      if(this.compensatoryRetencionArray.length>0){
        for (let i = 0; i < this.compensatoryRetencionArray.length; i++) {
          valorNetoRecibido -= (this.compensatoryRetencionArray[i].value/100)*capital;
        }
      }
      if(this.compensatorySegurosArray.length>0){
        for (let i = 0; i < this.compensatorySegurosArray.length; i++) {
          valorNetoRecibido -= (this.compensatorySegurosArray[i].value/100)*capital
        }
      }
      if(this.compensatoryPenalidadArray.length>0){
        for (let i = 0; i < this.compensatoryPenalidadArray.length; i++) {
          valorNetoRecibido -= (this.compensatoryPenalidadArray[i].value/100)*capital;
        }
      }
      if(this.compensatoryFormalizacionArray.length>0){
        for (let i = 0; i < this.compensatoryFormalizacionArray.length; i++) {
          valorNetoRecibido -= (this.compensatoryFormalizacionArray[i].value);
        }
      }
      if(this.compensatoryComisionArray.length>0){
        for (let i = 0; i < this.compensatoryComisionArray.length; i++) {
          valorNetoRecibido -= (this.compensatoryComisionArray[i].value);
        }
      }
      if(this.compensatoryOtrosArray.length>0){
        for (let i = 0; i < this.compensatoryOtrosArray.length; i++) {
          valorNetoRecibido -= (this.compensatoryOtrosArray[i].value);
        }
      }

      //console.log("Valor Neto Recibido: "+valorNetoRecibido)
      return Number(valorNetoRecibido).toFixed(2)
    } else {
      console.log("Tasa Nominal Mensual no encontrada");
      return 0
    }
  }

  calculateValorEntregado(){
    let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
    let valorNetoEntregado=capital

    if(this.compensatoryRetencionArray.length>0){
      for (let i = 0; i < this.compensatoryRetencionArray.length; i++) {
        valorNetoEntregado -= (this.compensatoryRetencionArray[i].value/100)*capital;
      }
    }
    if(this.compensatoryAdministrativosArray.length>0){
      for (let i = 0; i < this.compensatoryAdministrativosArray.length; i++) {
        valorNetoEntregado += (this.compensatoryAdministrativosArray[i].value);
      }
    }
    if(this.compensatoryPortesArray.length>0){
      for (let i = 0; i < this.compensatoryPortesArray.length; i++) {
        valorNetoEntregado += (this.compensatoryPortesArray[i].value);
      }
    }

    //console.log("valor Neto Entregado: " + valorNetoEntregado)
    return Number(valorNetoEntregado).toFixed(2)
  }

  simulate() {
    this.calculateInteresesCompensatorios()
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#ffffff';

    this.calculateTableData();

    if (this.PayFormGroup.valid && this.COKGroup.valid) {
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

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateTableData() {
    let COK : number = parseInt(<string>this.COKGroup.get('valor')?.value);
    let mes : number = parseInt(<string>this.userFormGroup.get('tiempo')?.value);
    let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
    let cuotaInicial: number = <number><unknown>this.userFormGroup.get('cuotaInicial')?.value;
    let tasa: number = <number><unknown>this.userFormGroup.get('tasa')?.value;
    let tipotasa: string = <string>this.userFormGroup.get('tipotasa')?.value;
    let seguro_valor : string = <string>this.PayFormGroup.get('seguro')?.value;
    let seguro_riesgo_valor: number = <number><unknown>this.PayFormGroup.get('seguro_riesgo')?.value;
    let cuota : number = 0;

    let meses_gracia: number = parseInt(<string>this.gracePeriodFormGroup.get('meses')?.value);
    let date = new Date(this.fecha);
    //let seguro_desgravamen: number = 0;
    let seguro_riesgo: number = ((seguro_riesgo_valor / 100) * capital) / 12;

    this.displayableCapital=this.formatCurrency(capital)

    console.log("Seguro Riesgo: ", seguro_riesgo)

    console.log("BBP: "+this.bonoBuenPagador)
    let bbp_bonus=0
    if(this.bonoBuenPagador){
      if (capital >= 57500 && capital <= 82200) {
        bbp_bonus = 17500;
      } else if (capital > 82200 && capital <= 123200) {
        bbp_bonus = 14400;
      } else if (capital > 123200 && capital <= 205300) {
        bbp_bonus = 12900;
      } else if (capital > 205300 && capital <= 304100) {
        bbp_bonus = 6200;
      } else if (capital > 304100 && capital <= 410600) {
        bbp_bonus = 0;
      } else {
        bbp_bonus = 0; // No aplica el subsidio
      }
    }
    console.log("BBP capital: "+bbp_bonus)
    //Capital - Cuota Inicial - Bono del Buen Pagador = Monto a Financiar
    this.montoFinal = capital - cuotaInicial-bbp_bonus;

    //Conversion de Tasa Nominal a Tasa Efectiva
    if (tipotasa == 'Tasa Nominal Anual') {
      tasa = tasa / 100
      tasa = (1 + tasa / 360)**(360) - 1
    }

    //Variable TEA = Tasa
    this.tea = tasa
    this.tea = parseFloat(this.tea.toFixed(7))

    //Calculo de la Tasa Mensual (TEM)
    this.tasa_mensual = (1 + (tasa / 100)) ** (30/ 360) - 1

    this.tasa_mensual_cuota = this.tasa_mensual

    let interes_k: number = 0.0
    let saldo: number = this.montoFinal
    let amortizacion: number = 0

    this.comisiones = this.calculateComisionValue()

    //Calculo de VAN y TIR
    const inversionInicial = this.montoFinal * - 1; // Inversión inicial (monto del préstamo)
    let flujoMensual = 0 // Cuota mensual constante

    // Construir el arreglo de flujos de caja
    const flujosDeCaja = [inversionInicial]; // Primer elemento es la inversión inicial

    //Calculo del periodo de gracia
    if(this.gracePeriod == 'Cero'){
      meses_gracia = 0
    }

    if(this.gracePeriod == 'Total'){
      for (let i = 0; i < meses_gracia; i++) {

        //Calculo del Seguro de desgravamen
        if (seguro_valor == 'Sin seguro') {
          this.seguro_desgravamen = 0
          this.valor_seguro = 0.0
        } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
          this.seguro_desgravamen  = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
          this.valor_seguro = 0.028
        } else {
          this.seguro_desgravamen  = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
          this.valor_seguro = 0.052
        }

        interes_k = saldo * this.tasa_mensual
        cuota = 0
        amortizacion = 0

        saldo = parseFloat((saldo + interes_k).toFixed(2))

        flujoMensual = cuota + this.comisiones + this.seguro_desgravamen  + seguro_riesgo;

        flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)));

        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat((cuota).toFixed(2)),
            saldo: saldo,
            comisiones: this.comisiones,
            seguro: parseFloat((this.seguro_desgravamen).toFixed(2)),
            flujo: parseFloat(flujoMensual.toFixed(2))
          }
        )
        date = new Date(date.setMonth(date.getMonth() + 1));
      }
    }

    if(this.gracePeriod == 'Parcial'){
      for (let i = 0; i < meses_gracia; i++) {

        //Calculo del Seguro de desgravamen
        if (seguro_valor == 'Sin seguro') {
          this.seguro_desgravamen  = 0
          this.valor_seguro = 0.0
        } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
          this.seguro_desgravamen  = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
          this.valor_seguro = 0.028
        } else {
          this.seguro_desgravamen  = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
          this.valor_seguro = 0.052
        }

        interes_k = saldo * this.tasa_mensual
        cuota = interes_k
        amortizacion = 0 //amortizacion = interes_k - cuota

        saldo = parseFloat((saldo + amortizacion).toFixed(2))

        flujoMensual = cuota + this.comisiones + this.seguro_desgravamen  + seguro_riesgo;

        flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)));

        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat((cuota).toFixed(2)),
            saldo: saldo,
            comisiones: this.comisiones,
            seguro: parseFloat((this.seguro_desgravamen ).toFixed(2)),
            flujo: parseFloat(flujoMensual.toFixed(2))
          }
        )
        date = new Date(date.setMonth(date.getMonth() + 1));
      }
    }

    //Calculo del Seguro de desgravamen
    if (seguro_valor == 'Sin seguro') {
      this.seguro_desgravamen = 0
      this.valor_seguro = 0.0
    } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
      this.seguro_desgravamen = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
      this.valor_seguro = 0.028
    } else {
      this.seguro_desgravamen = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
      this.valor_seguro = 0.052
    }

    console.log("TEM:", this.tasa_mensual_cuota * 100)

    console.log("TEM + Seguro:", this.tasa_mensual_cuota * 100 + 0.035)

    console.log("Seguro Desgravamen:", this.valor_seguro)

    //Metodo Interbank, añadimos seguro a la TEM
    this.tasa_mensual_cuota = (this.tasa_mensual_cuota * 100) + this.valor_seguro

    //Dividimos entre 100 para obtener el valor de la TEM
    this.tasa_mensual_cuota = this.tasa_mensual_cuota / 100

    let division_d =  ((1 + this.tasa_mensual_cuota) ** (mes - meses_gracia)) - 1

    //console.log("Division Down --> ", ((1 + tasa_mensual) ** mes) - 1)

    let division_u = this.tasa_mensual_cuota * ((1 + this.tasa_mensual_cuota) ** (mes - meses_gracia))

    //console.log("Division Upper --> ", tasa_mensual * ((1 + tasa_mensual) ** mes))

    cuota = saldo * (division_u / division_d)

    this.cuota = cuota

    for (let i = 0; i < mes-meses_gracia; i++) {

      //Calculo del Seguro de desgravamen
      if (seguro_valor == 'Sin seguro') {
        this.seguro_desgravamen = 0
        this.valor_seguro = 0.0
      } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
        this.seguro_desgravamen = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
        this.valor_seguro = 0.028
      } else {
        this.seguro_desgravamen = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
        this.valor_seguro = 0.052
      }

      interes_k = saldo * this.tasa_mensual

      console.log("Saldo: ", saldo + " * " + this.tasa_mensual + " = " + interes_k)

      //console.log("Interes K: ", interes_k)

      //amortizacion = cuota - interes_k

      amortizacion = cuota - interes_k - this.seguro_desgravamen

      //amortizacion = this.cuota - interes_k - seguro

      saldo = parseFloat((saldo - amortizacion).toFixed(2))

      flujoMensual = cuota + this.comisiones + seguro_riesgo

      flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)))

      this.ELEMENT_DATA?.push(
        {
          mes: meses_gracia + i + 1,
          vencimiento: date,
          amortizacion:  parseFloat(amortizacion.toFixed(2)),
          interes: parseFloat(interes_k.toFixed(2)),
          cuota: parseFloat((cuota).toFixed(2)),
          saldo: saldo,
          comisiones: this.comisiones,
          seguro: parseFloat((this.seguro_desgravamen ).toFixed(2)),
          flujo: parseFloat(flujoMensual.toFixed(2))
        }
      )
      date = new Date(date.setMonth(date.getMonth() + 1));
    }

    let cok = COK / 100
    let coki: number;

    coki = (Math.pow((1+cok),(30/360))) - 1

    const VAN_ = this.calcularVAN(flujosDeCaja, coki);
    const TIR_ = this.calcularTIRIncrementalMejorado(flujosDeCaja)
    this.TIR = Number((TIR_ * 100).toFixed(6));
    this.VAN = VAN_.toFixed(2);

    this.calculateTCEA(TIR_);

    console.log('VAN:', VAN_);
    console.log('TIR:', TIR_);
  }

  calculateComisionValue(){
    let capital: number = <number><unknown>this.userFormGroup.get('capital')?.value;
    let value=0

    if(this.compensatoryPenalidadArray.length>0){
      for (let i = 0; i < this.compensatoryPenalidadArray.length; i++) {
        value += (this.compensatoryPenalidadArray[i].value/100)*capital;
      }
    }
    if(this.compensatoryFormalizacionArray.length>0){
      for (let i = 0; i < this.compensatoryFormalizacionArray.length; i++) {
        value += (this.compensatoryFormalizacionArray[i].value);
      }
    }
    if(this.compensatoryComisionArray.length>0){
      for (let i = 0; i < this.compensatoryComisionArray.length; i++) {
        value += (this.compensatoryComisionArray[i].value);
      }
    }
    if(this.compensatoryOtrosArray.length>0){
      for (let i = 0; i < this.compensatoryOtrosArray.length; i++) {
        value += (this.compensatoryOtrosArray[i].value);
      }
    }
    if(this.compensatoryAdministrativosArray.length>0){
      for (let i = 0; i < this.compensatoryAdministrativosArray.length; i++) {
        value += (this.compensatoryAdministrativosArray[i].value);
      }
    }
    if(this.compensatoryPortesArray.length>0){
      for (let i = 0; i < this.compensatoryPortesArray.length; i++) {
        value += (this.compensatoryPortesArray[i].value);
      }
    }

    return value
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

  refresh(){
    location.reload();
  }

  openDialog(element: Schedule[]): void {
    const dialogRef = this.dialog.open(SaveDialogComponent,{
      data: element
    });
  }

  saveSchedule(){

    this.idUser = Number(localStorage.getItem('id'));

    let name = ""

    let meses = Number(this.userFormGroup.get('tiempo')!.value);
    let mesesPeriodo = Number(this.gracePeriodFormGroup.get('meses')!.value);
    let tipoGracia = this.gracePeriod;

    let cuota = this.cuota;
    let tem = this.tasa_mensual;
    let saldoInicial = this.montoFinal;
    let seguro = this.valor_seguro;

    console.log("Seguro Desgravamen Mandado: ", this.valor_seguro)

    let van = Number(this.VAN);
    let tir = this.TIR;
    let userId = this.idUser;

    this.sendData=[]
    this.sendData.push(
      {
        cuota: Number(cuota.toFixed(2)),
        name: name,
        tem: tem,
        saldoInicial: saldoInicial,
        seguroDesgravamen: seguro,
        periodoGracia: tipoGracia,
        periodoGraciaValor: mesesPeriodo,
        comisiones: this.comisiones,
        van: van,
        tir: Number(tir.toFixed(5)),
        tiempo: meses,
        userIdt: userId,
      });

    this.openDialog(this.sendData)

  }

  setBBP() {
    this.bonoBuenPagador = !this.bonoBuenPagador;

  }
}
