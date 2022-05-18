import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import * as AWS from 'aws-sdk';
import { environment } from './../../environments/environment.prod';


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
    console.log(this.cognitoSession.getIdToken().decodePayload())
    return this.cognitoSession.getIdToken().decodePayload()
  }


  get accessToken() {
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






}

