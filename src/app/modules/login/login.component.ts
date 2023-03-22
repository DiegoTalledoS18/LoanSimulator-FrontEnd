import {AfterViewInit, Component, ElementRef} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.services";
import {trigger} from "@angular/animations";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade',[

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
      .body.style.backgroundColor = '#e0ecf4';
  }

  login(){
    if(this.userFormGroup.valid) {
      this.isLoading = true;
      this.userService.authenticate(this.userFormGroup.get("username")?.value, this.userFormGroup.get("password")?.value).subscribe(
        (response) => {
          // local storage
          localStorage.setItem('id', String(response.id));
          this.route.navigate(['/home_calculator']);
          this.isLoading=false;
        },
        (error) => {
          this.isLoading=false;
        }
      );
    }
  }
}
