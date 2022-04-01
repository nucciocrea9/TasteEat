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

  food!: Food;
  constructor(private activatedRoute: ActivatedRoute, public foodService: FoodService, private cognito: CognitoService) {
    activatedRoute.params.subscribe((params) => {
      if (params.id)
        this.food = foodService.getFoodById(params.id)
    })
  }

  ngOnInit(): void {

  }

}
