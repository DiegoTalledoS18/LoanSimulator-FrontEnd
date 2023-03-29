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
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(30%)' }),
        animate(1200)
      ]),
      transition('* => void', [
        animate(1200, style({ transform: 'translateX(-30%)' }))
      ]),
    ]),

    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-30%)' }),
        animate(1200)
      ]),
      transition('* => void', [
        animate(1200, style({ transform: 'translateX(30%)' }))
      ])
    ])
  ]
})

export class RegisterComponent implements AfterViewInit {
  isLoading: boolean = false;
  userFormGroup = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.maxLength(20)
    ]),
    username: new FormControl('',[
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(15)
    ]),
    password: new FormControl('',[
      Validators.required, Validators.minLength(4),
      Validators.maxLength(8)
    ])
  });
  constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }

  register(){
    if(this.userFormGroup.valid) {
      this.isLoading = true;
      this.userService.create(this.userFormGroup.value).subscribe(
        (response) => {
          this.route.navigate(['/login']);
          this.isLoading=false;
        }
      );
    }

  }

}
