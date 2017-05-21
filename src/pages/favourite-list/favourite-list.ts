import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CookBookServices } from '../service/CookBookServices';

/**
 * Generated class for the FavouriteListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'FavouriteList'})
@Component({
  selector: 'page-favourite-list',
  templateUrl: 'favourite-list.html',
  providers: [CookBookServices]

})
export class FavouriteListPage {
  callback: any;
  CookBookUserList: Array<{ _id: string, CookBookNameEn: string, CookBookNameAr: string, ImageUrl: string, RecipieID: Array<String> }>
  MyCookBook: Array<{ CookBookId: string, CookBookName: string, IsSelectedForRecipie: boolean }>;
  IsNewCookBookClicked: boolean;
  NewcookBookName: string;
  SelectedRecipie: string
  LoggedInUserId: string;
  currentLanguage: string;

  constructor(public navCtrl: NavController, public translate: TranslateService, public storage: Storage, public CookBookServices: CookBookServices, public navParams: NavParams, public toastCtrl: ToastController) {
    this.IsNewCookBookClicked = false;
    this.currentLanguage = this.translate.currentLang;
    this.SelectedRecipie = navParams.get("RecipieId");
    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        this.LoggedInUserId = val;
        this.storage.get('FavList').then((CookBook) => {
          this.CookBookUserList = CookBook;
          this.MyCookBook = [];
          for (let i = 0; i < CookBook.length; i++) {
            let IsNoentryOfRecipieinCookBook = true;
            for (let j = 0; j < CookBook[i].RecipeId.length; j++) {
              if (CookBook[i].RecipeId[j] == this.SelectedRecipie) {
                IsNoentryOfRecipieinCookBook = false;
                this.MyCookBook.push({ CookBookId: CookBook[i]._id, CookBookName: this.currentLanguage == "en" ? CookBook[i].CookBookNameEn : CookBook[i].CookBookNameAr, IsSelectedForRecipie: true })
                break;
              }
            }
            if (IsNoentryOfRecipieinCookBook) {
              this.MyCookBook.push({ CookBookId: CookBook[i]._id, CookBookName: this.currentLanguage == "en" ? CookBook[i].CookBookNameEn : CookBook[i].CookBookNameAr, IsSelectedForRecipie: false })
            }
          }
        });
      });
    });
  }

  AddNewCookBook() {    
    this.IsNewCookBookClicked = true;
  }

  saveMyCookBook(item) {
    let cookBookInfo = new CookBookInfo(this.SelectedRecipie, item.CookBookId, this.LoggedInUserId);
    if (item.IsSelectedForRecipie) {
      this.CookBookServices.SetRecipieToCookBook(cookBookInfo).then((res: any) => {
        this.storage.set('FavList', res.CookBookUserList);
        this.SHowToastMessage("Recipie added to your cookbook");
      });
    }
    else {
      this.CookBookServices.RemoveRecipieFromCookBook(cookBookInfo).then((res: any) => {
        this.storage.set('FavList', res.CookBookUserList);
        this.SHowToastMessage("Recipie removed from your cookbook");
      });
    }
  }

  NewCookBookClicked() {
    let IsNameAlreadySelected: boolean;
    IsNameAlreadySelected = false;

    for(let i = 0; i < this.MyCookBook.length; i++){
      if(this.MyCookBook[i].CookBookName == this.NewcookBookName){
        IsNameAlreadySelected = true;
      }
    }
    if(!IsNameAlreadySelected){
      this.callback = this.navParams.get("closePopup")
      this.callback().then(()=>{});
      let newCookBookInfo = new NewCookBookInfo(this.SelectedRecipie, this.NewcookBookName, this.LoggedInUserId, "https://zadapp.s3.amazonaws.com/zad_375.jpeg");
      this.CookBookServices.SaveNewUserCookBook(newCookBookInfo).then((res: any) => {
        this.storage.set('FavList', res.CookBookUserList);
        this.SHowToastMessage("Recipie added to your newly created cookbook");
        this.NewcookBookName = "";
        this.IsNewCookBookClicked = false;
      });
    }
    else{
      this.SHowToastMessage("Name already exist in your cookbook");
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

export class CookBookInfo {
  recipeId: string;
  cookbookId: string;
  userId: string;
  constructor(RecipieID: string, CookBookId: string, UserId: string) {
    this.recipeId = RecipieID;
    this.cookbookId = CookBookId;
    this.userId = UserId;
  }
}

export class NewCookBookInfo {
  recipeId: string;
  cookBookName: string;
  userId: string;
  imageUrl: string
  constructor(RecipieID: string, CookBookName: string, UserId: string, imageUrl: string) {
    this.recipeId = RecipieID;
    this.cookBookName = CookBookName;
    this.userId = UserId;
    this.imageUrl = imageUrl;
  }
}