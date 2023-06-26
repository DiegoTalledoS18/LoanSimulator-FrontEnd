import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from "./dialog/dialog.component";

export interface Cronograma {
  cuota: number;
  name: string;
  tem: number;
  saldoInicial: number;
  seguroDesgravamen: number;
  van: number;
  tir: number;
  userIdt:number;
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})

export class SchedulesComponent {
  userName= ""
  ELEMENT_DATA: Cronograma[] = []
  displayedColumns: string[] = ['id', 'cuota', 'interes', 'saldofinal'];
  selectedElement: Cronograma | null = null;

  constructor(public dialog: MatDialog) {}


  ngOnInit(): void {
    this.userName = "Diego Talledo";

    this.ELEMENT_DATA = [
      {
        cuota: 1668.25,
        name: "Cronograma 1",
        tem: 0.32779,
        saldoInicial: 90000,
        seguroDesgravamen: 0.028,
        van: 23973.30,
        tir: 0.39967,
        userIdt: 1,
      },
      {
        cuota: 1781.30,
        name: "Cronograma 2",
        tem: 0.36908,
        saldoInicial: 70000,
        seguroDesgravamen: 0.028,
        van: 16953.10,
        tir: 0.245687,
        userIdt: 2,
      }
    ];
  }

  openDialog(element: Cronograma): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: element,
    });
  }
}
