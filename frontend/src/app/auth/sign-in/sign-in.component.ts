import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { CognitoService } from 'src/app/services/cognito.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  
  
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  email_address: string = "";
  password: string = "";

  constructor(private router: Router, private cognito: CognitoService) { }

  ngOnInit(): void { }

  onSignIn(form: NgForm){
    if (form.valid) {
     
      
      this.isLoading = true;
      const auth=this.cognito.signIn(this.email_address,this.password)
      if(auth){
        
        this.router.navigate(["home"])
        
      }

    }
  }
}
