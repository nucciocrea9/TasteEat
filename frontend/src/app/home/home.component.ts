import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FoodService } from '../services/food/food.service'
import { Food } from '../shared/models/Food';
import { CognitoService } from '../services/cognito.service';
import { TagsComponent } from '../tags/tags.component';
import * as AWS from 'aws-sdk';
import { HttpClient } from '@angular/common/http';
import {Ip} from '../shared/models/Ip';
import {Continents} from '../shared/models/continent';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];
  bAuthenticated = false;
  date:Ip[]=[];
  test:any[]=[]
  country: any
  setAuthorized: any;
  continent: Continents= new Continents()
   tags=new TagsComponent(this.foodService)
  apiUrl: any;
  bucket!: string;
  constructor(public foodService: FoodService, private route: ActivatedRoute, public cognitoService: CognitoService,  public http: HttpClient) { 
    
  }
  
  async ipLookup(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('https://ipapi.co/json/').subscribe(recipes => {
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
async selectApi(){
  
   
  if(await this.getContinent(await this.date[0].country_name)==='Europe'){
     this.apiUrl= environment.api_url_eu+'/getRecipes'
     this.bucket= environment.bucket_eu
  }
  
   else if(await this.getContinent(await this.date[0].region)==='Usa'){
    this.apiUrl= environment.api_url_us+'/getRecipes'
    this.bucket= environment.bucket_us
  }
  else if(await this.getContinent(await this.date[0].region)==='Usa1'){
    this.apiUrl= environment.api_url_us1+"/getRecipes"
    this.bucket= environment.bucket_us1
  }
  console.log(this.apiUrl)
  return this.apiUrl
  }   
  async ngOnInit(){
    
    if(this.cognitoService.getSessionValidity()){
    await this.ipLookup()
    
   await this.selectApi()
   
   
    this.cognitoService.refreshAwsCredentials()
    
    this.foodService.emptyarray()
    
    
      this.setAuthorized = true
      
      this.route.params.subscribe(params => {
        if (params.tag){
          
          this.foods = this.foodService.getFoodByTag(params.tag);
          console.log(this.foods)
        }
        
      })
      
      this.foods = this.foodService.getAll();
  
 
    this.foodService.getApi(await this.selectApi(),this.bucket)
   
   }
  }
  
}
