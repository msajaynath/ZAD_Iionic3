import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';

/**
 * Generated class for the CategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:"Categories"})
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  Categories1: Array<{Id: string, CategoryNameEn: string, CategoryNameAr: string, CategoryImageUrl: string}>;
  Categories2: Array<{Id: string, CategoryNameEn: string, CategoryNameAr: string, CategoryImageUrl: string}>;
  currentLanguage: string;

  constructor(public navCtrl: NavController,  private app: App, public translate: TranslateService, public storage:Storage, public navParams: NavParams) {
    this.currentLanguage = this.translate.currentLang;
    this.storage.get('FullLookUp').then((val) => {    
        if(val.length > 0){
          if(val[0].CategoryTag != null){
            this.Categories1 = val[0].CategoryTag;
            let halfCat = Math.round(val[0].CategoryTag.length/2)
            this.Categories2 = this.Categories1.splice(0,halfCat);
          }
        }
      })
    }

    Logout() {
    this.storage.clear();
    this.app.getRootNav().push('SetPreference');
  }
  
    CategoryClicked(event, item) {
      this.navCtrl.push('Recipes', {
        PageName: "Categories",
        categoryId: item._id
      });
    }
  } 
