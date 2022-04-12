import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food/food.service';
import { CognitoService } from '../services/cognito.service';
import { Order } from '../shared/models/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  setAuthorized: any;
  orders: Order[] = [];
  constructor(public foodService:FoodService, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.foodService.orders=[]
    this.cognitoService.init((action) => {
    if (action === this.cognitoService.ACTION_SIGNIN) 
      this.setAuthorized = true
    this.orders= this.foodService.getAllorders()
    })
    this.orders= this.foodService.getOrders()

    }

    isOrdered(order: Order, day: string) : boolean{
      const giorno = new Date(order.time.substring(0,10).split("/").reverse().join("/")).getDay()
      
      return this.days[giorno-1]===day ? true : false
    }
}
