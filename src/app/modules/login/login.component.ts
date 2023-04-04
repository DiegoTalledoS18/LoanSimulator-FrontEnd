import {AfterViewInit, Component, ElementRef} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.services";
import {state, style, animate, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('flyInOutLogin', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(30%)' }),
        animate(1500)
      ]),
      transition('* => void', [
        animate(1500, style({ transform: 'translateY(-30%)' }))
      ]),
    ]),

    trigger('slideInOutLogin', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(30%)' }),
        animate(1500)
      ]),
      transition('* => void', [
        animate(1500, style({ transform: 'translateX(-30%)' }))
      ])
    ])
  ]
})

export class LoginComponent implements AfterViewInit {
  isLoading: boolean = false;
  userFormGroup = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });
  constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e4efff';
  }


  login(){
    if(this.userFormGroup.valid) {
      this.isLoading = true;
      this.userService.authenticate(this.userFormGroup.get("username")?.value, this.userFormGroup.get("password")?.value).subscribe(
        (response) => {
          // local storage
          localStorage.setItem('id', String(response.id));
          this.route.navigate(['/register']);
          this.isLoading=false;
        },
        (error) => {
          this.isLoading=false;
        }
      );
    }
  }
}
