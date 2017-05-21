import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { ShoppingListServices } from '../service/ShoppingListService';
import { Storage } from '@ionic/storage';

@IonicPage({name:'ShoppingList'})
@Component({
  selector: 'page-shoppin-list',
  templateUrl: 'shoppin-list.html',
  providers: [ShoppingListServices]

})
export class ShoppinListPage {
  shoppingList: any;
  tempShoppingListAsCategory: any;
  tempShoppingListAsRecipe: any;
  ShoppingListAsCategory: any;
  ShoppingListAsRecipe: any;
  selectedGroup: string;
  options: any;
  LoggedInUserid: string

  constructor(public navCtrl: NavController, public shoppingListServices: ShoppingListServices, public storage: Storage, public navParams: NavParams, public toastCtrl: ToastController) {
    this.shoppingList = [];
    this.selectedGroup = 'Categories'
    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        if (val == null) {
          let loginParams = new LoginParams('ShoppingList', val)
          this.navCtrl.push('Login', {
            params: loginParams
          });
        }
        else if (val.length > 0) {
          this.LoggedInUserid = val;
          this.storage.get('UserShoppingList').then((UserSList) => {
            this.shoppingList = [];
            if(UserSList != null)
              this.shoppingList = UserSList;
            this.populateData()  
          });
        }
      });
    });    
  }

  populateData(){
    this.tempShoppingListAsCategory = this.sortByKey(this.shoppingList, 'ShoppingListCategoryName');
    
    this.ShoppingListAsCategory = []    
    let CurrentCategoryComplete = false;
    let recipeIngredentInfo;
    let categoryDetailsInfo;
    
    for(let i = 0; i< this.tempShoppingListAsCategory.length; i++){
      if(i == 0){
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsCategory[i].recipeIngredentId,this.tempShoppingListAsCategory[i].recipeIngredentName)
        categoryDetailsInfo = new CategoryDetails(this.tempShoppingListAsCategory[i]._id, this.tempShoppingListAsCategory[i].ShoppingListCategoryId,this.tempShoppingListAsCategory[i].ShoppingListCategoryName)
        categoryDetailsInfo.ShoppingListIngredentInfo.push(recipeIngredentInfo)
        this.ShoppingListAsCategory.push(categoryDetailsInfo);
        if(i + 1 < this.tempShoppingListAsCategory.length){
          if(this.tempShoppingListAsCategory[i].ShoppingListCategoryId != this.tempShoppingListAsCategory[i + 1].ShoppingListCategoryId)
            CurrentCategoryComplete = true;
        }
      }
      else if(i > 0 && i < this.tempShoppingListAsCategory.length && !CurrentCategoryComplete){
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsCategory[i].recipeIngredentId,this.tempShoppingListAsCategory[i].recipeIngredentName)
        this.ShoppingListAsCategory[this.ShoppingListAsCategory.length - 1].ShoppingListIngredentInfo.push(recipeIngredentInfo);
         if(i + 1 < this.tempShoppingListAsCategory.length){
          if(this.tempShoppingListAsCategory[i].ShoppingListCategoryId != this.tempShoppingListAsCategory[i + 1].ShoppingListCategoryId)
            CurrentCategoryComplete = true;
         }
      }
      else if(i > 0 && i < this.tempShoppingListAsCategory.length && CurrentCategoryComplete){
        CurrentCategoryComplete = false;
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsCategory[i].recipeIngredentId,this.tempShoppingListAsCategory[i].recipeIngredentName)
        categoryDetailsInfo = new CategoryDetails(this.tempShoppingListAsCategory[i]._id, this.tempShoppingListAsCategory[i].ShoppingListCategoryId,this.tempShoppingListAsCategory[i].ShoppingListCategoryName)
        categoryDetailsInfo.ShoppingListIngredentInfo.push(recipeIngredentInfo);

        this.ShoppingListAsCategory.push(categoryDetailsInfo);
        if(i + 1 < this.tempShoppingListAsCategory.length){
          if(this.tempShoppingListAsCategory[i].ShoppingListCategoryId != this.tempShoppingListAsCategory[i + 1].ShoppingListCategoryId)
            CurrentCategoryComplete = true;
        }
      }
    }

    this.tempShoppingListAsRecipe = this.sortByKey(this.shoppingList, 'recipeName');
    this.ShoppingListAsRecipe = []    
    let CurrentRecipeComplete = false;
    let RecipeDetailsInfo;
    for(let i = 0; i< this.tempShoppingListAsRecipe.length; i++){
      if(i == 0){
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsRecipe[i].recipeIngredentId,this.tempShoppingListAsRecipe[i].recipeIngredentName)
        RecipeDetailsInfo = new RecipeInfo(this.tempShoppingListAsCategory[i]._id, this.tempShoppingListAsRecipe[i].recipeId,this.tempShoppingListAsRecipe[i].recipeName,this.tempShoppingListAsRecipe[i].recipeImageUrl)
        RecipeDetailsInfo.ShoppingListIngredentInfo.push(recipeIngredentInfo)
        this.ShoppingListAsRecipe.push(RecipeDetailsInfo);
        if(i + 1 < this.tempShoppingListAsRecipe.length){
          if(this.tempShoppingListAsRecipe[i].recipeId != this.tempShoppingListAsRecipe[i + 1].recipeId)
            CurrentRecipeComplete = true;
        }
      }
      else if(i > 0 && i < this.tempShoppingListAsRecipe.length && !CurrentRecipeComplete){
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsRecipe[i].recipeIngredentId,this.tempShoppingListAsRecipe[i].recipeIngredentName)
        this.ShoppingListAsRecipe[this.ShoppingListAsRecipe.length - 1].ShoppingListIngredentInfo.push(recipeIngredentInfo);
         if(i + 1 < this.tempShoppingListAsRecipe.length){
          if(this.tempShoppingListAsRecipe[i].recipeId != this.tempShoppingListAsRecipe[i + 1].recipeId)
            CurrentRecipeComplete = true;
         }
      }
      else if(i > 0 && i < this.tempShoppingListAsRecipe.length && CurrentRecipeComplete){
        CurrentRecipeComplete = false;
        recipeIngredentInfo = new RecipeIngredentDetails(this.tempShoppingListAsRecipe[i].recipeIngredentId,this.tempShoppingListAsRecipe[i].recipeIngredentName)
        RecipeDetailsInfo = new RecipeInfo(this.tempShoppingListAsCategory[i]._id, this.tempShoppingListAsRecipe[i].recipeId,this.tempShoppingListAsRecipe[i].recipeName,this.tempShoppingListAsRecipe[i].recipeImageUrl)
        RecipeDetailsInfo.ShoppingListIngredentInfo.push(recipeIngredentInfo);

        this.ShoppingListAsRecipe.push(RecipeDetailsInfo);
        if(i + 1 < this.tempShoppingListAsRecipe.length){
          if(this.tempShoppingListAsRecipe[i].recipeId != this.tempShoppingListAsRecipe[i + 1].recipeId)
            CurrentRecipeComplete = true;
        }
      }
    }
  }

  removeIngredent(item){
    this.shoppingListServices.RemoveFromShoppingList(item, this.LoggedInUserid).then((res: any) => {
      this.storage.set('UserShoppingCart', res.ShoppingCart);
      this.storage.set('UserShoppingList', res.ShoppingList);
      this.shoppingList = res.ShoppingList
      this.SHowToastMessage("Ingredent removed to your ShoppingList");
      this.populateData()  
    });
  }

  SHowToastMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    })
    toast.present();
  }

  SelectGroup(item){
    this.selectedGroup = item;
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  ClearAllIngredents(ind) {
    this.shoppingList.splice(ind, 1);
  }

  GetRecipeDetails(recipeId){
    	this.navCtrl.push('RecipieDetails', {
			recipeId: recipeId,
      PageName: 'ShoppingList'
		});
  }
}

export class CategoryDetails {
  Id                                  : string;
	ShoppingListCategoryId							: string;
  ShoppingListCategoryName            : string;
  ShoppingListIngredentInfo           : Array<{RecipeIngredentDetails}>
	constructor( Id : string, ShoppingListCategoryId 	: string,	ShoppingListCategoryName : string) {
    this.Id = Id;
		this.ShoppingListCategoryId = ShoppingListCategoryId;								
		this.ShoppingListCategoryName = ShoppingListCategoryName;
    this.ShoppingListIngredentInfo = [];
	}	
}

export class RecipeInfo {
  Id                                  : string;
	RecipeId							: string;
  RecipeName            : string;
  RecipeImageUrl        : string
  ShoppingListIngredentInfo           : Array<{RecipeIngredentDetails}>
	constructor( Id : string, RecipeId 	: string,	RecipeName : string, RecipeImageUrl: string) {
		this.Id = Id;
    this.RecipeId = RecipeId;								
		this.RecipeName = RecipeName;
    this.RecipeImageUrl = RecipeImageUrl;
    this.ShoppingListIngredentInfo = [];
	}	
}

export class RecipeIngredentDetails {
	recipeIngredentId							: string
  recipeIngredentName            : string;
	constructor( recipeIngredentId 	: string,	recipeIngredentName : string) {
		this.recipeIngredentId = recipeIngredentId;								
		this.recipeIngredentName = recipeIngredentName;
	}	
}

export class LoginParams {
  PageName       : string;
	UserId				: string;
	constructor( PageName : string, UserId 	: string) {
    this.PageName = PageName;
		this.UserId = UserId;								
	}	
}