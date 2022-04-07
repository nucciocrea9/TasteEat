import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FoodService } from '../services/food/food.service'
import { Food } from '../shared/models/Food';
import { CognitoService } from '../services/cognito.service';
import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];
  bAuthenticated = false;


  setAuthorized: any;
   tags=new TagsComponent(this.foodService)
  constructor(public foodService: FoodService, private route: ActivatedRoute, private cognitoService: CognitoService) { 
    
  }

  ngOnInit(): void {
    this.foodService.emptyarray()

    this.cognitoService.init((action) => {

      if (action === this.cognitoService.ACTION_SIGNIN) 
      this.setAuthorized = true
      
      this.route.params.subscribe(params => {
        if (params.tag){
          
          this.foods = this.foodService.getFoodByTag(params.tag);
        }
      })
      
      this.foods = this.foodService.getAll();
    });
    this.foodService.getApi()
    
  }
    
}
