import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FoodService } from '../services/food/food.service'
import { Food } from '../shared/models/Food';
import { CognitoService } from '../services/cognito.service';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];
  bAuthenticated = false;
  auth: any;

  setAuthorized: any;

  constructor(public foodService: FoodService, private route: ActivatedRoute, public cognitoService: CognitoService, private router: Router) { }

  ngOnInit(): void {

    this.cognitoService.init((action) => {
      if (action === this.cognitoService.ACTION_SIGNIN) this.setAuthorized = true
      this.foods = this.foodService.getAll();
    });

    this.route.params.subscribe(params => {
      if (params.tag)
        this.foods = this.foodService.getFoodByTag(params.tag);
    })
  }

}
