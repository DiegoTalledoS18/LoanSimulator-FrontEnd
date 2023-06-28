import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Schedule} from "../../../models/schedule";

export interface table {
  cuota: number;
  interes: number;
  saldo_final: number;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  ELEMENT_DATA: table[] = []
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

    let saldo=0
    let saldoInicial=this.data.saldoInicial
    let cuota =this.data.cuota
    let tem=this.data.tem
    let seguroDesgravamen=this.data.seguroDesgravamen
    let periodoGracia =this.data.periodoGracia
    let periodoGraciaValor =this.data.periodoGraciaValor
    let van=this.data.van
    let tir=this.data.tir
    let mesesgracia=0
    //Calculo del periodo de gracia

    if(periodoGracia == "Cero"){

    }

    if(periodoGracia == 'Total'){
      for (let i = 0; i < periodoGraciaValor; i++) {

        let seguro=seguroDesgravamen*saldoInicial
        let interes_k = saldoInicial * tem
        cuota = 0
        let amortizacion = 0
        saldo = parseFloat((saldo + interes_k).toFixed(2))

        this.ELEMENT_DATA?.push(
          {
            cuota: cuota,
            interes: interes_k,
            saldo_final: saldo,
          }
        )
      }
    }

    if(periodoGracia == 'Parcial'){
      for (let i = 0; i < periodoGraciaValor; i++) {
        let seguro=seguroDesgravamen*saldoInicial
        let interes_k = saldoInicial * tem
        cuota = interes_k
        let amortizacion = 0

        saldo = parseFloat((saldo + amortizacion).toFixed(2))

        this.ELEMENT_DATA?.push(
          {
            cuota: cuota,
            interes: interes_k,
            saldo_final: saldo,
          }
        )
      }
    }
    /*
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



    this.calculateTCEA(tir);

    console.log('VAN:', VAN_);
    console.log('TIR:', TIR_);*/
  }
}
