import { getTestBed, TestBed } from '@angular/core/testing';
import { jest, describe, expect, test,beforeEach,afterEach } from "@jest/globals";
import { FoodService } from './food.service';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http'
import { ServiceDiscovery } from 'aws-sdk';
/*
describe('FoodService', () => {
  let service: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule,RouterTestingModule]});
    service = TestBed.inject(FoodService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  test('test', () => {
    let recipes=service.getApi()
    
    recipes=[{
      id: 1,
      name: 'patate',
      cookTime: '10',
      price: 5,
      origins: ['usa','italy'],
      imageUrl: '',
      tags: ['All','SlowFood']
    }]
    expect(recipes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({id:1, name:'patate'})
      ])
    )
   
  });
});
*/
describe('MyService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: FoodService;

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpClientTestingModule,RouterTestingModule],
          providers: [],
      });
      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
      service = TestBed.inject(FoodService);
  });

  afterEach(() => {
      httpMock.verify();
  });


test('should return recipes array', () => {
  const recipes=[{
    id: 1,
    name: 'patate',
    cookTime: '10',
    price: 5,
    origins: ['usa','italy'],
    imageUrl: '',
    tags: ['All','SlowFood']
  }];

  expect(recipes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({id:1, name:'patate'})
    ])
  )
});
});