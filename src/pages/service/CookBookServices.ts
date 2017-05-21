import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { AppSettings } from './generalservices';

@Injectable()

export class CookBookServices {
  constructor(private http: Http) { }

  SetRecipieToCookBook(CookBookInfo) {
    return new Promise(resolve => {
      this.http.post(AppSettings.CookBookUrl + 'addRecipe', CookBookInfo)
        .subscribe(data => {
          resolve(data.json());
        }, error => {
          console.log("Oooops!");
        });
    });
  }

  RemoveRecipieFromCookBook(CookBookInfo) {
    return new Promise(resolve => {
      this.http.post(AppSettings.CookBookUrl + 'removeRecipe', CookBookInfo)
        .subscribe(data => {
          resolve(data.json());
        }, error => {
          console.log("Oooops!");
        });
    });
  }

  SaveNewUserCookBook(CookBookInfo) {
    return new Promise(resolve => {
      this.http.post(AppSettings.CookBookUrl + 'addRecipeCustom', CookBookInfo)
        .subscribe(data => {
          resolve(data.json());
        }, error => {
          console.log("Oooops!");
        });
    });
  }
}

