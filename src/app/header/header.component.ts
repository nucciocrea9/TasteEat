import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {



  constructor(public cognito: CognitoService) { }


  ngOnInit(): void {

  }

  logout() {

    this.cognito.signOut();
  }

}
