import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { AppSettings } from './generalservices';

@Injectable()

export class ShoppingListServices {
  constructor(private http: Http) { }

  SetIngredentToShopingList(ShoppingListInfo) {
    return new Promise(resolve => {
      this.http.post(AppSettings.ShoppingListUrl + 'add', ShoppingListInfo)
        .subscribe(data => {
          resolve(data.json());
        }, error => {
          console.log("Oooops!");
        });
    });
  }

  RemoveFromShoppingList(shoppingListId, userId  ) {
    alert(shoppingListId);
    return new Promise(resolve => {
      this.http.post(AppSettings.ShoppingListUrl + 'remove', {shoppingListId: shoppingListId , userId  :userId   })
        .subscribe(data => {
          resolve(data.json());
        }, error => {
          console.log("Oooops!");
        });
    });
  }
}