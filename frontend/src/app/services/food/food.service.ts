import { Injectable } from '@angular/core';
import { Food } from '../../shared/models/Food';
import { Tag } from '../../shared/models/Tag';
import { Order } from '../../shared/models/Order';
import * as AWS from 'aws-sdk';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router';
import { Ip } from 'src/app/shared/models/Ip';
import { Continents } from 'src/app/shared/models/continent';


@Injectable({
  providedIn: 'root'
})


export class FoodService {
  
  elements: Food[] ;
  orders: Order[];
  date:Ip[]=[];
  continent: Continents= new Continents()
  apiUrl:any
  constructor(public http: HttpClient, public cognito: CognitoService , private router: Router) {
     this.elements = []
     this.orders=[]
  }

  getUrl(file: string,bucket): string {
    
    const params = {
      Bucket: bucket,
      Key: file
    };
    
    let s3 = new AWS.S3();
   
    return s3.getSignedUrl('getObject', { Bucket: params.Bucket, Key: params.Key });
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
    const country='Europe'
    if(await this.getContinent(await this.date[0].country_name)==='Europe'){
      this.apiUrl= environment.api_url_eu+'/order'
      
   }
   
    if(await this.getContinent(await this.date[0].country_name)==='Usa'){
     this.apiUrl= environment.api_url_us+'/order'
    
   }
   if(await this.getContinent(await this.date[0].country_name)==='Usa1'){
     this.apiUrl= environment.api_url_us1+"/order"
     
   }
   console.log(this.apiUrl)
   return this.apiUrl
}
  getFoodById(id: number): Food {
    return this.getAll().find(food => food.id == id)!;
  }

  getFoodByTag(tag: string): Food[] {
    
    return tag == "All" ? this.getAll() : this.getAll().filter(food => food.tags?.includes(tag));
  }

  emptyarray() {
    this.elements = []
  }

  async createOrder(recipe_name, recipe_price){
    let firstName: any; 
    await this.ipLookup()
    //console.log(this.date[0].countryCode)
   // console.log(this.test[0])
   await this.selectApi()
    this.cognito.getIdToken()
        .pipe()  //this will limit the observable to only one value
        .subscribe((val) => {
            firstName = val; 
        });
    const headers = { "Authorization": firstName}
    console.log(firstName)
    const name=recipe_name.replace(/ /g,"_")
    const params={name: name, price: recipe_price }
    const options = { params: params, headers: headers };
    //this.cognito.refreshAwsCredentials()
    this.http.post<any>(await this.selectApi(), null, options).subscribe(res=>{});
   // await this.selectApi()
    //this.router.navigate(['/home'])
  }

   getOrders(api_url,bucket) : Order[]{
    let firstName: any; 

    this.cognito.getIdToken()
        .pipe()  //this will limit the observable to only one value
        .subscribe((val) => {
            firstName = val; 
        });
        console.log(firstName)
    const headers = { "Authorization": firstName}
    this.http.get<any>(api_url, { headers }).subscribe(orders => {
    
     orders.forEach((order: any) => {
        const temp = {
          name: order.name.replace(/_/g, " "),
          price: order.price,
          imageUrl: '',
          time: order.time,
          expiration: order.expiration
        }
        this.orders.push(temp);
      })
      this.orders.forEach((element) => {
        element.imageUrl = this.getUrl(element.name.replace(/\s/g, "") + '.jpg',bucket)
      })
    })
    return this.orders
  }
getAllorders(){
  return this.orders;
}
  getApi(api_url,bucket){
    let firstName: any; 
    
    this.cognito.getIdToken()
        .pipe()  //this will limit the observable to only one value
        .subscribe((val) => {
            firstName = val; 
        });
    console.log(firstName);
    
    const headers = { "Authorization": firstName}
    this.http.get<any>(api_url, { headers }).subscribe(async (recipes) => {

      recipes.forEach((recipe: any) => {
        const temp = {
          id: recipe.recipe_id.N,
          name: recipe.recipe_name.S,
          cookTime: recipe.cook_time.S,
          price: recipe.price.N,
          origins: recipe.origins.SS,
          imageUrl: '',
          tags: recipe.tags.SS
        }
       
        this.elements.push(temp);
      })
      this.elements.forEach((element) => {
        
        element.imageUrl = this.getUrl(element.name.replace(/\s/g, "") + '.jpg', bucket)
      })
      
    })
   //console.log(AWS.config.getCredentials)
    return this.elements
  }

  getAllTags(): Tag[] {
    return [
      { name: 'All', count: this.getAll().length },
      { name: 'FastFood', count: this.getFoodByTag('FastFood').length },
      { name: 'Pizza', count: this.getFoodByTag('Pizza').length },
      { name: 'Lunch', count: this.getFoodByTag('Lunch').length },
      { name: 'SlowFood', count: this.getFoodByTag('SlowFood').length },
      { name: 'Hamburger', count: this.getFoodByTag('Hamburger').length },
      { name: 'Fry', count: this.getFoodByTag('Fry').length }
    ];

  }
   getAll(): Food[] {
    
    
    return this.elements;

  }
}
