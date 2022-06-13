import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { FoodPageComponent } from './food-page/food-page.component';
import { OrdersComponent } from './orders/orders.component';
import { SignUpComponent } from 'src/app/auth/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/auth/sign-in/sign-in.component';
import { CognitoService } from './services/cognito.service';
import { AuthGuard } from './auth/auth-guard.guard';
//import { AuthService } from './auth/auth.service';
//import { AuthGuard } from './auth/auth-guard.guard'

const routes: Routes = [
  //{path: '', component: HomeComponent},
  //{path:'food/:id', component: FoodPageComponent},
  //{path:'tag/:tag', component: HomeComponent},
  //{path:'orders', component: OrdersComponent}
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'signin', component: SignInComponent,},
  { path: 'signup', component: SignUpComponent,},
  {path:'food/:id', component: FoodPageComponent},
  {path:'tag/:tag', component: HomeComponent},
  {path:'orders', component: OrdersComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CognitoService]
})
export class AppRoutingModule { }
