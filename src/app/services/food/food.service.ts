import { Injectable } from '@angular/core';
import { Food } from '../../shared/models/Food';
import { Tag } from '../../shared/models/Tag';
import { Order } from '../../shared/models/Order';
import * as AWS from 'aws-sdk';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class FoodService {
  
  elements: Food[] ;
  orders: Order[];
  
  constructor(private http: HttpClient, private cognito: CognitoService , private router: Router) {
     this.elements = []
     this.orders=[]
  }

  getUrl(file: string): string {
   
    const params = {
      Bucket: environment.bucket,
      Key: file
    };
    let s3 = new AWS.S3();

    return s3.getSignedUrl('getObject', { Bucket: params.Bucket, Key: params.Key });
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

  createOrder(recipe_name, recipe_price){
    const headers = { "Authorization": this.cognito.accessToken }
    const name=recipe_name.replace(/ /g,"_")
    const params={name: name, price: recipe_price }
    const options = { params: params, headers: headers };
    this.http.post<any>(environment.api_url1, null, options).subscribe(res=>{});
    this.router.navigate(['/'])
  }

  getOrders() : Order[]{
    const headers = { "Authorization": this.cognito.accessToken }
    this.http.get<any>(environment.api_url2, { headers }).subscribe(orders => {
    
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
        element.imageUrl = this.getUrl(element.name.replace(/\s/g, "") + '.jpg')
      })
    })
    return this.orders
  }
getAllorders(){
  return this.orders;
}
 getApi() {
    const headers = { "Authorization": this.cognito.accessToken }
    this.http.get<any>(environment.api_url, { headers }).subscribe((recipes) => {

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
        element.imageUrl = this.getUrl(element.name.replace(/\s/g, "") + '.jpg')
      })
      
    })
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
