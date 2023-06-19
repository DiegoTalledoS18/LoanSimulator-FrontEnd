import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  name : string ;

  constructor(private route:ActivatedRoute, private router: Router) {
    this.name = this.route.snapshot.paramMap.get('name')!;
  }

  ngOnInit(): void {
  }

  Logout(): void{
    this.router.navigate(['/login']);
  }

}
