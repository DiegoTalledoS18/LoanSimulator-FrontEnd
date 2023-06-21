import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  name : string;

  constructor(private route:ActivatedRoute, private router: Router) {

    //console.log("MODULE ---> ",this.login.currentUserName);
    this.name = "";
  }

  ngOnInit(): void {
  }

  Logout(): void{
    this.router.navigate(['/login']);
  }

}
