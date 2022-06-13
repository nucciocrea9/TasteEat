/*import { Injectable } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import {CognitoService} from '../../app/services/cognito.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cognito:CognitoService) { }

  isLoggedIn():boolean {
    
    var isAuth = false;

    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
   
    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid();
      })
    }
    
   return isAuth;
  }
  
}
*/