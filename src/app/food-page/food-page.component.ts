import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoService } from '../services/cognito.service';
import { FoodService } from '../services/food/food.service';
import { Food } from '../shared/models/Food';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {
  setAuthorized: any;
  food!: Food;
  constructor(private activatedRoute: ActivatedRoute, public foodService: FoodService, private cognito: CognitoService) {
    
  }

  ngOnInit(): void {
    this.cognito.init((action) => {

      if (action === this.cognito.ACTION_SIGNIN) 
        this.setAuthorized = true
     
    })
    this.activatedRoute.params.subscribe((params) => {
      if (params.id)
        this.food = this.foodService.getFoodById(params.id)
        
    })
  }
  
}
