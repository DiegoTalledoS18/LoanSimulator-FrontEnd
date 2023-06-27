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
  idUser = 0;
  ELEMENT_DATA: Schedule[] = []
  data: any;
  element: Schedule | undefined;
  displayedColumns: string[] = ['id', 'cuota', 'interes', 'saldo final'];
  selectedElement: Schedule | null = null;

  constructor(private scheduleService: ScheduleService ,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.userName = String(localStorage.getItem('name'));

    this.idUser = Number(localStorage.getItem('id'));

    console.log("ID LOCAL STORAGE: ", this.idUser);

    this.scheduleService.getById(this.idUser).subscribe((response) => {
      console.log(response)

      this.data = response;

      this.data.forEach((element: { cuota: number; name: string; tem: number; saldoInicial: number; seguroDesgravamen: number; periodoGracia: number; van: number; tir: number; userIdt: number; }) => {
        this.ELEMENT_DATA.push({
          cuota: element.cuota,
          name: (element.name).toUpperCase(),
          tem: element.tem,
          saldoInicial: element.saldoInicial,
          seguroDesgravamen: element.seguroDesgravamen,
          periodoGracia: element.periodoGracia,
          van: element.van,
          tir: element.tir,
          userIdt: element.userIdt,
        });

        console.log(this.ELEMENT_DATA);

      });
    });
  }

  openDialog(element: Schedule): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: element,
    });
  }

}
