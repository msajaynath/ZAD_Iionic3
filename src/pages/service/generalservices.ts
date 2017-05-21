import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class CommonServices {
  CategoryTag: Array<{ Id: string, CategoryNameEn: string, CategoryNameAr: string, CategoryImageUrl: string }>;
  CookingTypeTag: Array<{ Id: string, CookingTypeNameEn: string, CookingTypeNameAr: string }>;
  CusineTag: Array<{ Id: string, CusineNameEn: string, CusineNameAr: string }>;
  Time: Array<{ Id: string, TimeEn: string, TimeAr: string }>;
  Calories: Array<{ Id: string, CaloriesNameEn: string, CaloriesNameAr: string }>;
  public profileUrl = "https://s3.ap-south-1.amazonaws.com/zadapp/ProfileImages/";

  public LookUp: any;
  constructor(private http: Http) { }

  GetAllLookUp() {
    this.LookUp = [];
    return new Promise(resolve => {
      this.http.get(AppSettings.LookUpUrl + 'getall').map(res => res.json())
      .subscribe(data => {
        resolve(data);
      }, error => {
        console.log("Oooops!");
      });
    });
  }
   GetKey() {
    this.LookUp = [];
    return new Promise((resolve,reject) => {
      this.http.get(AppSettings.APIUrl + 'getKey').map(res => res.json())
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject();
      });
    });
  }
}

export class AppSettings {
  public static APIUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/";
  public static LookUpUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/masterdata/";
  public static UserServiceUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/users/";
  public static RecipeServiceUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/recipe/";
  public static CookBookUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/cookBook/";
  public static ShoppingListUrl = "https://pacific-mesa-18419.herokuapp.com/zadapi/v1/cart/";
}