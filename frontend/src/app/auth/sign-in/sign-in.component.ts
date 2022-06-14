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
  //providers:[AuthService,CognitoService]
  
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  email_address: string = "";
  password: string = "";

  constructor(private router: Router, private cognito: CognitoService) { }

  ngOnInit(): void { }

  onSignIn(form: NgForm){
    if (form.valid) {
     
      //this.isLoading = true;
      //this.cognito.authenticate(this.email_address,this.password)
      //this.router.navigate(["home"])
      
      this.isLoading = true;
      const auth=this.cognito.signIn(this.email_address,this.password)
      if(auth){
        
        this.router.navigate(["home"])
        
      }
     /* let authenticationDetails = new AuthenticationDetails({
          Username: this.email_address,
          Password: this.password,
      });
      let poolData = {
        UserPoolId: environment.UserPoolId, // Your user pool id here
        ClientId: environment.ClientId // Your client id here
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.email_address, Pool: userPool };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.router.navigate(["home"])
          return result.getIdToken().getJwtToken()
        },
        onFailure: (err) => {
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
      });
      */

    }
  }
}
