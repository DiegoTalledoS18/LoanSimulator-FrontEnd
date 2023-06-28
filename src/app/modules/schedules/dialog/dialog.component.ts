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
  displayedColumns: string[] = ['cuota', 'interes', 'saldo_final'];
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedule
  ) {
    this.calculateTableData()
    console.log(this.ELEMENT_DATA)
  }
  calculateTableData() {
    this.ELEMENT_DATA=[]
    //Data del Backend
    let saldoInicial = this.data.saldoInicial
    let cuota = this.data.cuota
    let tem = this.data.tem
    let seguroDesgravamen = this.data.seguroDesgravamen
    let periodoGracia = this.data.periodoGracia
    let periodoGraciaValor = this.data.periodoGraciaValor
    let tiempo = this.data.tiempo

    //Variables de calculo
    let saldo = 0;
    let interes_k = 0.0;
    let amortizacion = 0.0;
    let seguro = 0.0;


    if(periodoGracia == "Cero"){
      console.log("Periodo de gracia cero")
    }

    if(periodoGracia == 'Total'){
      for (let i = 0; i < periodoGraciaValor; i++) {

        //let seguro = seguroDesgravamen * saldoInicial
        interes_k = saldoInicial * tem
        cuota = 0
        amortizacion = 0
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

        interes_k = saldoInicial * tem
        cuota = interes_k
        amortizacion = 0

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

    for (let i = 0; i < tiempo - periodoGraciaValor; i++) {

      seguro = seguroDesgravamen * saldoInicial
      interes_k = saldoInicial * tem
      amortizacion = cuota - interes_k - seguro

      saldo = parseFloat((saldo - amortizacion).toFixed(2))

      this.ELEMENT_DATA?.push(
        {
          cuota: cuota,
          interes: interes_k,
          saldo_final: saldo,
        }
      )
    }
  }
}
