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
        animate(1500)
      ]),
      transition('* => void', [
        animate(1500, style({ transform: 'translateY(-30%)' }))
      ]),
    ]),

    trigger('slideInOut', [
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

export class RegisterComponent implements AfterViewInit {
  isLoading: boolean = false;
  userFormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });
  constructor(private route: Router, private elementRef: ElementRef, private userService: UserService) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#e0ecf4';
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
