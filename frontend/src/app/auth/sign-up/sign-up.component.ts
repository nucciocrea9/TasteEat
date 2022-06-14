import { Component, OnInit } from '@angular/core';
import { CognitoUserPool,CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgModule }      from '@angular/core';
import {CognitoService} from '../../services/cognito.service'
import { HttpClient } from '@angular/common/http';
import {Ip} from '../../shared/models/Ip'
import {Continents} from '../../shared/models/continent';

interface formDataInterface {
  "given_name": string;
 
  "email": string;

  [key: string]: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],

})
export class SignUpComponent implements OnInit {
  isLoading:boolean = false;
  fname:string = '';
  
  email:string = '';
 
  password:string = '';
  attributeList: any=[];
  isConfirm!: boolean;
  code!: string;
  date:Ip[]=[];
  continent: Continents= new Continents()
  
  constructor(private router: Router, private cognito: CognitoService, public http: HttpClient) { }

  ngOnInit(): void {}

  async ipLookup(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('http://ip-api.com/json').subscribe(recipes => {
            this.date.push(recipes);
           
            resolve();
        });
    });
}

async getContinent(country:string) {
  
  
  const get=this.continent.continent_map.filter(item=>item.countries.includes(country))
  const test=get[0].continent
  console.log(test)
     return test
}


 async onSignup(form: NgForm){
    if (form.valid) {
      this.isLoading = true;
      await this.ipLookup()
      console.log(this.date[0].country)
      let formData:formDataInterface = {
        "given_name": this.fname,
        "email": this.email,
        "zoneinfo":await this.getContinent(this.date[0].country)
      }
 
      for (let key  in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        }
        console.log(attrData)
        let attribute = new CognitoUserAttribute(attrData);
        this.attributeList.push(attribute)
      }
      console.log(this.attributeList)
      this.cognito.signUp(this.email, this.password, this.attributeList)
      
      this.isConfirm=true
     }
    else{
      alert("Invalid")
    }
}

confirmSignUp(){
  this.cognito.confirmSignUp(this.email, this.code)
  this.router.navigate(['/signin']);
}
}
