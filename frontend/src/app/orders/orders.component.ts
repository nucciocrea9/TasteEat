import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { CognitoService } from '../services/cognito.service';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import {Ip} from '../shared/models/Ip';
import {Continents} from '../shared/models/continent';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  setAuthorized: any;
  orders: Order[] = [];
  sortedOrders: any = [];
  date:Ip[]=[];
  test:any[]=[]
  country: any
 
  continent: Continents= new Continents()
  
  apiUrl: any;
  bucket!: string;
  constructor(public foodService: FoodService, private cognitoService: CognitoService,private http:HttpClient) { }

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
     this.apiUrl=environment.api_url_eu+'/getOrders'
     this.bucket=environment.bucket_eu
  }
  
   if(await this.getContinent(await this.date[0].country_name)==='Usa'){
    this.apiUrl=environment.api_url_us+'/getOrders'
    this.bucket=environment.bucket_us
  }
  if(await this.getContinent(await this.date[0].country_name)==='Usa1'){
    this.apiUrl=environment.api_url_us1+"/getOrders"
    this.bucket=environment.bucket_us1
  }
  console.log(this.apiUrl)
  return this.apiUrl
  }   
  async ngOnInit(){
    if(this.cognitoService.getSessionValidity()){
    this.foodService.orders = []
    await this.ipLookup()
   // console.log(this.date[0].countryCode)
   // console.log(this.test[0])
   await this.selectApi()
   
    //this.cognitoService.init((action) => {
     // if (action === this.cognitoService.ACTION_SIGNIN)
        this.setAuthorized = true
      this.orders = this.foodService.getAllorders()
   // })
    this.orders = this.foodService.getOrders(await this.selectApi(),this.bucket)

  }
}
  sort(day: string) {
    const date=new Date().toISOString();
    const now=date.substring(0,10).split("-").join("/")
    console.log(now)
    this.sortedOrders = this.orders.filter(obj =>  {console.log(obj.time,obj.expiration); return obj.time.includes(day) && obj.expiration>=now});
    
  }

  isOrdered(order: Order, day: string): boolean {
    const giorno = new Date(order.time.substring(0, 10).split("/").reverse().join("/")).getDay()

    return this.days[giorno - 1] === day ? true : false
  }
}
