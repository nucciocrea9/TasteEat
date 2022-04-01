import { Injectable } from '@angular/core';
import { Food } from '../../shared/models/Food';
import { Tag } from '../../shared/models/Tag';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})

export class FoodService {


  constructor() { }

  getUrl(file: string): string {


    const params = {
      Bucket: 'eu-west-region-bucket',
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
    const elements = [
      {
        id: 1,
        name: 'secondi-di-carne.jpg',
        cookTime: '10-20',
        price: 10,
        favorite: false,
        origins: ['italy'],
        stars: 4.5,
        imageUrl: '',
        tags: ['FastFood', 'Pizza', 'Lunch'],
      },
      {
        id: 2,
        name: 'SH_bruschetta_al_pomodoro-1200x800.jpg',
        price: 20,
        cookTime: '20-30',
        favorite: true,
        origins: ['persia', 'middle east', 'china'],
        stars: 4.7,
        imageUrl: '',
        tags: ['SlowFood', 'Lunch'],
      },
      {
        id: 3,
        name: 'SH_lasagne_bolognese.jpg',
        price: 5,
        cookTime: '10-15',
        favorite: false,
        origins: ['germany', 'us'],
        stars: 3.5,
        imageUrl: '',
        tags: ['FastFood', 'Hamburger'],
      },
      {
        id: 4,
        name: 'SH_pancake_americani-1200x800.jpg',
        price: 2,
        cookTime: '15-20',
        favorite: true,
        origins: ['belgium', 'france'],
        stars: 3.3,
        imageUrl: '',
        tags: ['FastFood', 'Fry'],
      }
    ]
    elements.forEach((element: Food) => {
      element.imageUrl = this.getUrl(element.name)
    })
    return elements;

  }
}
