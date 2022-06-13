/*import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  authData: any;
  cognitoAuth: any;
  cognitoSession: any;

  ACTION_SIGNIN = "SignIn";
  ACTION_SIGNOUT = "SignOut";
  ACTION_REFRESH_CREDENTIALS = "Refresh credentials"

  onSuccess = (action) => console.log(action)
  onFailure = (action, err) => console.error(action, err)



  constructor(private router: Router) {
    this.getAuthInstance();
  }


  getAuthInstance() {
    this.authData = {
      ClientId: environment.ClientId,
      AppWebDomain: environment.AppWebDomain,
      TokenScopesArray: environment.TokenScopesArray,
      RedirectUriSignIn: environment.RedirectUriSignIn,
      UserPoolId: environment.UserPoolId,
      RedirectUriSignOut: environment.RedirectUriSignOut
    
    }

    this.cognitoAuth = new CognitoAuth(this.authData);

    this.cognitoAuth.userhandler = {
      onSuccess: async (result) => {

        this.cognitoSession = result;
        await this.refreshAwsCredentials();
        this.onSuccess(this.ACTION_SIGNIN);


      },
      onFailure: error => {
        console.log('Error: ' + error);
        onFailure: (err) => this.onFailure(this.ACTION_SIGNIN, err);
      }
    }
  }
  init(onSuccess) {
    this.onSuccess = onSuccess ?? this.onSuccess
    this.cognitoAuth.getSession();
    if (this.router.url.indexOf('#access_token') !== -1) {
      this.cognitoAuth.parseCognitoWebResponse(this.router.url);
      this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('#access_token')));

    }
  }

  signOut() {
    this.cognitoSession = null
    this.cognitoAuth.signOut();
    this.onSuccess(this.ACTION_SIGNOUT);
  }

  get isAuthorized() {
    return this.cognitoSession !== null;
  }

  get tokenPayload() {
    return this.cognitoSession.getIdToken().decodePayload()
  }


  get accessToken() {
    //console.log(this.cognitoSession.getIdToken().getJwtToken())
    return this.cognitoSession.getIdToken().getJwtToken();
  }

  get isAuthenticated() {
    return this.cognitoAuth.isUserSignedIn(this.cognitoSession);
  }
  async refreshAwsCredentials() {
    if (!AWS.config.credentials) {
      AWS.config.region = environment.region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: environment.IdentityPoolId,
        Logins: {
          [`cognito-idp.${environment.region}.amazonaws.com/${environment.UserPoolId}`]: this.cognitoSession.getIdToken().getJwtToken()
        }
      });
    }

    if ((<AWS.CognitoIdentityCredentials>AWS.config.credentials).data == null) {// is expired
      await new Promise<void>((res, rej) => (<AWS.CognitoIdentityCredentials>AWS.config.credentials).refresh((err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }))).catch(e => this.onFailure(this.ACTION_REFRESH_CREDENTIALS, e));
    }
    this.onSuccess(this.ACTION_REFRESH_CREDENTIALS);

    return (< AWS.CognitoIdentityCredentials > AWS.config.credentials).data['Credentials'];
  }

*/

import { Injectable } from '@angular/core';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  CognitoUserAttribute,
  CognitoAccessToken,
  CognitoIdToken
} from 'amazon-cognito-identity-js';
import { Observable, Observer, of, throwError } from 'rxjs';
import * as AWS from 'aws-sdk';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { CognitoIdentity, CognitoIdentityCredentials, CognitoIdentityServiceProvider } from 'aws-sdk';

const POOLDATA = {
  UserPoolId: environment.UserPoolId,
  ClientId: environment.ClientId
};

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  user:any
  ACTION_SIGNIN = "SignIn";
  ACTION_SIGNOUT = "SignOut";
  ACTION_REFRESH_CREDENTIALS = "Refresh credentials"
  cognitoSession: any;
  router!: Router;
  cognitoAuth: any;
  username:any
  authData:any
  onSuccess = (action) => console.log(action)
  onFailure = (action, err) => console.error(action, err)

  
  getUserPool(): CognitoUserPool {
    return new CognitoUserPool(POOLDATA);
  }

  

  signUp(username: string,password: string, attributes: [{ Name: string; Value: string }]) {
    AWS.config.credentials=null
    const userPool = this.getUserPool();
    const attributeList = attributes.map(
      attribute => new CognitoUserAttribute(attribute)
    );
    
    
      userPool.signUp(
        username,
        password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            return 
          }
          
          
        }
      );
     
   
  }

  confirmSignUp(username: string, code: string){
    const userData = {
      Username: username,
      Pool: this.getUserPool()
    };
    this.user = new CognitoUser(userData);
   
      this.user.confirmRegistration(code, true, (err, result) => {
        if (err) {
          return (err);
        }
       (result);
      });
    
  }

  signIn(email_address,password):boolean{
    
    let authenticationDetails = new AuthenticationDetails({
      Username: email_address,
      Password: password,
  });
  let poolData = {
    UserPoolId: environment.UserPoolId, // Your user pool id here
    ClientId: environment.ClientId // Your client id here
  };
  let params = {
    UserAttributes: [{
        Name: 'zoneinfo',
        Value: 'Europe'
    }],
    UserPoolId: environment.UserPoolId,
    Username: email_address
};
  let userPool = new CognitoUserPool(poolData);
  let userData = { Username: email_address, Pool: userPool };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async (result) => {
     
      this.onSuccess(this.ACTION_SIGNIN)
      this.refreshAwsCredentials()
      
      //this.router.navigate(["home"])
      //return result.getIdToken().getJwtToken()
      
      return true
    },
    onFailure: (err) => {
      alert(err.message || JSON.stringify(err));
      //this.isLoading = false;
    },
  });
  return true
  }

  authenticate(
    username: string,
    password: string
  ){
    const userPool = this.getUserPool();
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });
    const userData = {
      Username: username,
      Pool: userPool
    };

    this.user = new CognitoUser(userData);
   
    return Observable.create((observer: Observer<any>) => {
      this.user.authenticateUser(authDetails, {
        onSuccess: async result => {
          //await this.refreshAwsCredentials()
          console.log(AWS.config.credentials)
          observer.next(result);
         // this.router.navigate(["home"])
         
          

          // const accessToken = result.getAccessToken().getJwtToken();
          // const idToken = result.idToken.jwtToken;
         
        },

        onFailure: err => observer.error(err),
        mfaRequired: (challengeName, challengeParameters) => {
          return observer.error('MFA :D');
          
        }
      });
    });
  }

  
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.user.changePassword(
        'Testing12345!',
        'Testing1234!',
        (err, result) => {
          if (err) {
            return observer.error(err);
          }
          observer.next(result);
        }
      );
    });
  }

  
  getCurrentUser() {
     
    return of(this.getUserPool().getCurrentUser());
  }

  getSessionValidity(): Observable<boolean> {
    const user = this.getUserPool().getCurrentUser();

    if (user) {
      return Observable.create((observer: Observer<any>) => {
        user.getSession((err, session) => {
        
          if (err) {
            return observer.error(err);
          }
          //this.router.navigate(["home"])
          observer.next(session.isValid());
        });
      });
    } else {
      return of(false);
    }
  }

  getSession(): Observable<CognitoUserSession | null> {
    const user = this.getUserPool().getCurrentUser();

    if (user) {
      return Observable.create((observer: Observer<any>) => {
        user.getSession((err, session) => {
          this.refreshAwsCredentials()
          if (err) {
            return observer.error(err);
          }
          
          observer.next(session);
        });
      });
    } else {
      return throwError(null);
    }
  }

  getAccessToken(): Observable<CognitoAccessToken> {
    const user= this.getUserPool().getCurrentUser();

    if (user) {
      return Observable.create((observer: Observer<any>) => {
        user.getSession((err, session: CognitoUserSession) => {
          if (err) {
            return observer.error(err);
          }
          observer.next(session.getAccessToken());
        });
      });
    } else {
      return throwError(null);
    }
  }

  getIdToken(): Observable<CognitoIdToken> {
    const user= this.getUserPool().getCurrentUser();

    if (user) {
      return Observable.create((observer: Observer<any>) => {
        user.getSession((err, session: CognitoUserSession) => {
          if (err) {
            return observer.error(err);
          }
          observer.next(session.getIdToken().getJwtToken());
        });
      });
    } else {
      return throwError(null);
    }
  }

  signOut(): void {
    const user = this.getUserPool().getCurrentUser();
    if (user != null) {
      user.signOut();
      this.onSuccess(this.ACTION_SIGNOUT)
      //window.localStorage.removeItem(`CognitoIdentityId-${environment.IdentityPoolId}`)
    }
  }

  isLoggedIn():boolean {
    
    var isAuth = false;

    let poolData = {
      UserPoolId: environment.UserPoolId,
      ClientId: environment.ClientId
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
   //console.log(cognitoUser)
    if (cognitoUser != null) {
      cognitoUser.getSession(async (err: any, session: any) => {
        // this.refreshAwsCredentials()
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        
        //this.refreshAwsCredentials()
        isAuth = session.isValid();
       
      
      })
     
    }
    
   return isAuth;
  }

  
  async refreshAwsCredentials() {
    let firstName: any; 
    
    this.getIdToken().subscribe((val) => {
            firstName = val; 
        });
        
    if (!AWS.config.credentials) {
      AWS.config.region = environment.region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: environment.IdentityPoolId,
        Logins: {
          [`cognito-idp.${environment.region}.amazonaws.com/${environment.UserPoolId}`]: firstName
        }
      });
    }
    (<AWS.CognitoIdentityCredentials>AWS.config.credentials).clearCachedId()
    if ((<AWS.CognitoIdentityCredentials>AWS.config.credentials).data == null) {// is expired
      
      await new Promise<void>((res, rej) => (<AWS.CognitoIdentityCredentials>AWS.config.credentials).refresh((err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }))).catch(e => this.onFailure(this.ACTION_REFRESH_CREDENTIALS, e));
    }
    this.onSuccess(this.ACTION_REFRESH_CREDENTIALS);
   
    return (< AWS.CognitoIdentityCredentials > AWS.config.credentials).data['Credentials'];
  }
  
}





