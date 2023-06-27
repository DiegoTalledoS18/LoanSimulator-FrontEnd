import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Schedule} from "../../../models/schedule";
import {Router} from "@angular/router";
import {ScheduleService} from "../../../services/schedule.services";

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.css']
})
export class SaveDialogComponent {
  constructor(private route: Router, private scheduleService: ScheduleService,
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedule[]
  ) {
  }
  sendData(){
    this.data.forEach(element => {
      console.log("element: "+element.cuota+element.tem,element.saldoInicial)
      this.scheduleService.create(element).subscribe(response2 => {
        console.log("Response 2: ", response2);
      })
    });
    console.log(this.data);

    this.route.navigate(['/calculator/schedules']);
  }
}
