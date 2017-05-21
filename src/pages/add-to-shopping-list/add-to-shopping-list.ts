import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { LanguageService } from '../service/language';
import { ShoppingListServices } from '../service/ShoppingListService';
import {TranslateService} from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AddToShoppingListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'AddToShoppingList'})
@Component({
  selector: 'page-add-to-shopping-list',
  templateUrl: 'add-to-shopping-list.html',
  providers: [ShoppingListServices, LanguageService]

})
export class AddToShoppingListPage {
  callback: any;
  IsNewIngredentCategoryClicked: boolean;
  shoppingListInfo: any;
  SelectedList: string;
  LoggedInUserId: string;
  currentLanguage: string;
  UserShoppingList;
  ShoppingCart;
  NewShoppingListCategoryName: string;

  constructor(public navCtrl: NavController, public language: LanguageService, public shoppingListServices: ShoppingListServices, public translate: TranslateService, public storage: Storage, public navParams: NavParams, public toastCtrl: ToastController) {
    this.IsNewIngredentCategoryClicked = false;
    this.currentLanguage = language.getValue();
    this.SelectedList = "CategoryWise";
    this.currentLanguage = this.translate.currentLang;
    this.shoppingListInfo = navParams.get("shoppingListInfo");

    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        this.LoggedInUserId = val;
        this.storage.get('UserShoppingCart').then((UserSList) => {
          this.storage.get('FullLookUp').then((SList) => {
            this.UserShoppingList = [];
            this.ShoppingCart = [];
            this.UserShoppingList = UserSList;
            this.ShoppingCart = SList[0].ShoppingCart;;
            //this.UserShoppingList.concat(UserSList);
            //this.UserShoppingList = [{ShoppingListCategoryname: 'Polutary', ShoppingListCategoryId: 'fshfsh'}, {ShoppingListCategoryname: 'Grocery', ShoppingListCategoryId: 'truerurt'}, {ShoppingListCategoryname: 'Vegatables', ShoppingListCategoryId: 'bvmvbmv'}]
          });
        });
      });
    });
  }

  AddNewShoppingListCategory() {
    // this.callback = this.navParams.get("closePopup")
    // this.callback().then(()=>{});
    this.IsNewIngredentCategoryClicked = true;
  }

  saveMyShoppingList(item) {
    let shoppingListName;
    if(this.currentLanguage == 'ar')
      shoppingListName = item.ShoppingListCategoryNameAr;
    else
      shoppingListName = item.ShoppingListCategoryNameEn;

    let shoppingListInfo = new ShoppingListInfo(shoppingListName, this.shoppingListInfo.IngredentName, this.shoppingListInfo.RecipeId, this.shoppingListInfo.RecipeName,
                                this.shoppingListInfo.RecipeImageUrl, this.LoggedInUserId, item._id, this.shoppingListInfo.IngredentId);
    this.callback = this.navParams.get("closePopup")
    this.callback(this.shoppingListInfo).then(() => { });
    this.shoppingListServices.SetIngredentToShopingList(shoppingListInfo).then((res: any) => {
      this.storage.set('UserShoppingCart', res.ShoppingCart);
      this.storage.set('UserShoppingList', res.ShoppingList);
      this.SHowToastMessage("Ingredent added to your ShoppingList");
    });
  }

  NewShoppingListClicked() {
    let IsNameAlreadySelected: boolean;
    IsNameAlreadySelected = false;

    for(let i = 0; i < this.UserShoppingList.length; i++){
      if(this.UserShoppingList[i].ShoppingListCategoryNameEn == this.NewShoppingListCategoryName){
        IsNameAlreadySelected = true;
      }
    }
    for(let i = 0; i < this.ShoppingCart.length; i++){
      if(this.ShoppingCart[i].ShoppingListCategoryNameEn == this.NewShoppingListCategoryName){
        IsNameAlreadySelected = true;
      }
    }

    if(!IsNameAlreadySelected){        
      let shoppingListInfo = new ShoppingListInfo(this.NewShoppingListCategoryName, this.shoppingListInfo.IngredentName, this.shoppingListInfo.RecipeId, this.shoppingListInfo.RecipeName,
                                  this.shoppingListInfo.RecipeImageUrl, this.LoggedInUserId, '', this.shoppingListInfo.IngredentId);
                              
      this.callback = this.navParams.get("closePopup")
      this.callback(this.shoppingListInfo).then(() => { });                        
      this.shoppingListServices.SetIngredentToShopingList(shoppingListInfo).then((res: any) => {
        this.storage.set('UserShoppingCart', res.ShoppingCart);
        this.storage.set('UserShoppingList', res.ShoppingList)
        this.SHowToastMessage("Ingredent added to your newly created ShoppingList");
        this.NewShoppingListCategoryName = "";
        this.IsNewIngredentCategoryClicked = false;
      });
    }
    else{
      this.SHowToastMessage("Name already exist in your Shopping list");
    }  
  }

  SHowToastMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    })
    toast.present();
  }
}

export class ShoppingListInfo {
  ShoppingListCategoryName: string;  
  recipeIngredentName: string;
  recipeId: string;
  recipeName: string;
  recipeImageUrl: string;
  userId: string;
  ShoppingListCategoryId: string;
  recipeIngredentId: string;

  constructor(ShoppingListCategoryName: string, recipeIngredentName: string, recipeId: string,
    recipeName: string, recipeImageUrl: string, userId: string, ShoppingListCategoryId: string, recipeIngredentId: string) {
    this.ShoppingListCategoryName = ShoppingListCategoryName;
    this.recipeIngredentName = recipeIngredentName;
    this.recipeId = recipeId;
    this.recipeName = recipeName;
    this.recipeImageUrl = recipeImageUrl;
    this.userId = userId;
    this.ShoppingListCategoryId = ShoppingListCategoryId;
    this.recipeIngredentId = recipeIngredentId;
  }
}