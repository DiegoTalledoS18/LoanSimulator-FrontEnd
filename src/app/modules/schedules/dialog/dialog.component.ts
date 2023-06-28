import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Schedule} from "../../../models/schedule";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  displayedColumns: string[] = ['cuota', 'interes', 'saldo final'];
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedule
  ) {

  }
  calculateTableData() {

    /*cuota: number;
    name: string;
    tem: number;
    saldoInicial: number;
    seguroDesgravamen: number;
    periodoGracia: number;
    van: number;
    tir: number;
    userIdt: number;*/

    /*let COK : number = parseInt(<string>this.COKGroup.get('valor')?.value);
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
    let valor_seguro: number = 0.0;

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

    let comisiones = this.calculateComisionValue()

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
          valor_seguro = 0.0
        } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
          this.seguro_desgravamen  = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
          valor_seguro = 0.028
        } else {
          this.seguro_desgravamen  = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
          valor_seguro = 0.052
        }

        interes_k = saldo * this.tasa_mensual
        cuota = 0
        amortizacion = 0

        saldo = parseFloat((saldo + interes_k).toFixed(2))

        flujoMensual = cuota + comisiones + this.seguro_desgravamen  + seguro_riesgo;

        flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)));

        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat((cuota).toFixed(2)),
            saldo: saldo,
            comisiones: comisiones,
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
        } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
          this.seguro_desgravamen  = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
        } else {
          this.seguro_desgravamen  = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
        }

        interes_k = saldo * this.tasa_mensual
        cuota = interes_k
        amortizacion = 0 //amortizacion = interes_k - cuota

        saldo = parseFloat((saldo + amortizacion).toFixed(2))

        flujoMensual = cuota + comisiones + this.seguro_desgravamen  + seguro_riesgo;

        flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)));

        this.ELEMENT_DATA?.push(
          {
            mes: i + 1,
            vencimiento: date,
            amortizacion:  parseFloat(amortizacion.toFixed(2)),
            interes: parseFloat(interes_k.toFixed(2)),
            cuota: parseFloat((cuota).toFixed(2)),
            saldo: saldo,
            comisiones: comisiones,
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
      valor_seguro = 0.0
    } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
      this.seguro_desgravamen = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
      valor_seguro = 0.028
    } else {
      this.seguro_desgravamen = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
      valor_seguro = 0.052
    }

    console.log("TEM:", this.tasa_mensual_cuota * 100)

    console.log("TEM + Seguro:", this.tasa_mensual_cuota * 100 + 0.035)

    console.log("Seguro Desgravamen:", valor_seguro)

    //Metodo Interbank, añadimos seguro a la TEM
    this.tasa_mensual_cuota = (this.tasa_mensual_cuota * 100) + valor_seguro

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
        valor_seguro = 0.0
      } else if (seguro_valor == 'Convencional individual' || seguro_valor == 'Con devolución individual') {
        this.seguro_desgravamen = 0.00028 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.035%
        valor_seguro = 0.028
      } else {
        this.seguro_desgravamen = 0.00052 * saldo //Porcentaje para el seguro de Desgravamen en el Interbank es 0.065%
        valor_seguro = 0.052
      }

      interes_k = saldo * this.tasa_mensual

      //amortizacion = cuota - interes_k

      amortizacion = cuota - interes_k - this.seguro_desgravamen

      //amortizacion = this.cuota - interes_k - seguro

      saldo = parseFloat((saldo - amortizacion).toFixed(2))

      flujoMensual = cuota + comisiones + seguro_riesgo

      flujosDeCaja.push(parseFloat(flujoMensual.toFixed(2)))

      this.ELEMENT_DATA?.push(
        {
          mes: meses_gracia + i + 1,
          vencimiento: date,
          amortizacion:  parseFloat(amortizacion.toFixed(2)),
          interes: parseFloat(interes_k.toFixed(2)),
          cuota: parseFloat((cuota).toFixed(2)),
          saldo: saldo,
          comisiones: comisiones,
          seguro: parseFloat((this.seguro_desgravamen ).toFixed(2)),
          flujo: parseFloat(flujoMensual.toFixed(2))
        }
      )
      date = new Date(date.setMonth(date.getMonth() + 1));
    }

    let cok = COK / 100 //0.2 --> COK
    let coki: number;

    coki = (Math.pow((1+cok),(30/360))) - 1

    const VAN_ = this.calcularVAN(flujosDeCaja, coki);
    const TIR_ = this.calcularTIRIncrementalMejorado(flujosDeCaja)
    this.TIR = Number((TIR_ * 100).toFixed(6));
    this.VAN = VAN_.toFixed(2);

    this.calculateTCEA(TIR_);

    console.log('VAN:', VAN_);
    console.log('TIR:', TIR_);*/
  }
}
