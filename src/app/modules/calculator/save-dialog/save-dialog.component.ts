import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Schedule} from "../../../models/schedule";
import {Router} from "@angular/router";
import {ScheduleService} from "../../../services/schedule.services";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.css']
})
export class SaveDialogComponent {

  NameGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  constructor(private route: Router, private scheduleService: ScheduleService,
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Schedule[]
  ) {
  }
  sendData(){
    let username : string = <string>this.NameGroup.get('name')?.value;

    if(this.NameGroup.valid){
      this.data.forEach(element => {
        let elementUpdated=element
        elementUpdated.name=username
        this.scheduleService.create(elementUpdated).subscribe(response2 => {
          console.log("Response 2: ", response2);
        })
      });
      this.dialogRef.close();
      this.route.navigate(['/calculator/schedules']);
    }

  }
}
