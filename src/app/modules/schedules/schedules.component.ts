import {Component, OnInit } from '@angular/core';
import {ScheduleService} from "../../services/schedule.services";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {Schedule} from "../../models/schedule";

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent {
  userName= ""
  ELEMENT_DATA: Schedule[] = []
  data: any;
  element: Schedule | undefined;
  displayedColumns: string[] = ['id', 'cuota', 'interes', 'saldo final'];
  selectedElement: Schedule | null = null;

  constructor(private scheduleService: ScheduleService ,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.userName = "Diego Talledo";

    this.scheduleService.getAll().subscribe((response) => {
      console.log(response)

      this.data = response;

      this.data.forEach((element: { cuota: number; name: string; tem: number; saldoInicial: number; seguroDesgravamen: number; van: number; tir: number; userIdt: number; }) => {
        this.ELEMENT_DATA.push({
          cuota: element.cuota,
          name: (element.name).toUpperCase(),
          tem: element.tem,
          saldoInicial: element.saldoInicial,
          seguroDesgravamen: element.seguroDesgravamen,
          van: element.van,
          tir: element.tir,
          userIdt: element.userIdt,
        });

        console.log(this.ELEMENT_DATA);

      });
    });

    this.ELEMENT_DATA = [
      {
        cuota: 1668.25,
        name: "Cronograma 1".toUpperCase(),
        tem: 0.32779,
        saldoInicial: 90000,
        seguroDesgravamen: 0.028,
        van: 23973.30,
        tir: 0.39967,
        userIdt: 1,
      },
      {
        cuota: 1781.30,
        name: "Cronograma 2".toUpperCase(),
        tem: 0.36908,
        saldoInicial: 70000,
        seguroDesgravamen: 0.028,
        van: 16953.10,
        tir: 0.245687,
        userIdt: 2,
      },
      {
        cuota: 1668.25,
        name: "Cronograma 3".toUpperCase(),
        tem: 0.42779,
        saldoInicial: 1000,
        seguroDesgravamen: 0.028,
        van: 23973.30,
        tir: 0.39967,
        userIdt: 1,
      },
      {
        cuota: 1781.30,
        name: "Cronograma 4".toUpperCase(),
        tem: 0.56908,
        saldoInicial: 800,
        seguroDesgravamen: 0.028,
        van: 16953.10,
        tir: 0.245687,
        userIdt: 2,
      }
    ];

  }

  openDialog(element: Schedule): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: element,
    });
  }

}
