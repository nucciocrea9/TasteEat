import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { FoodPageComponent } from './food-page/food-page.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path:'food/:id', component: FoodPageComponent},
  {path:'tag/:tag', component: HomeComponent},
  {path:'orders', component: OrdersComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
