import {AfterViewInit, Component, ElementRef} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.services";
import {state, style, animate, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(30%)' }),
        animate(2000)
      ]),
      transition('* => void', [
        animate(2000, style({ transform: 'translateY(-30%)' }))
      ]),
    ]),

    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(30%)' }),
        animate(2000)
      ]),
      transition('* => void', [
        animate(2000, style({ transform: 'translateX(-30%)' }))
      ])
    ])
  ]
})

export class RegisterComponent implements AfterViewInit {
  isLoading: boolean = false;
  userFormGroup = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });
  constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e0ecf4';
  }

}
