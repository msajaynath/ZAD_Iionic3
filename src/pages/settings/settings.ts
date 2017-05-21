import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController,App, NavParams ,LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ProfileDetails } from '../Models/ProfileDetails'
import { LanguageService } from '../service/language';
import { UserService } from '../service/UserServices';

@IonicPage({name:'Settings'})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [UserService, LanguageService]

})
export class SettingsPage{
  ShowItem: number;
  resultText: String;
  LookUp: Array<{
    CategoryTag: Array<{ _id: string, CategoryNameEn: string, CategoryNameAr: string, IsSelected: boolean }>,
    CookingTypeTag: Array<{ _id: string, CookingTypeNameEn: string, CookingTypeNameAr: string, IsSelected: boolean }>,
    CusineTag: Array<{ _id: string, CusineNameEn: string, CusineNameAr: string, IsSelected: boolean }>,
    Time: Array<{ Id: string, TimeEn: string, TimeAr: string }>,
    Calories: Array<{ Id: string, CaloriesNameEn: string, CaloriesNameAr: string }>
  }>;
  profileInfo: ProfileDetails;
  userId: string;
  currentLanguage: string;
  IsLoggedIn: boolean;
  UserPreferedCategory: Array<string>;
  UserPreferedCusine: Array<string>;
  UserPreferedCookingType: Array<string>;

  constructor(public navCtrl: NavController , public toastCtrl: ToastController,public loadingCtrl: LoadingController, private app: App, public storage: Storage, public translate: TranslateService, public language: LanguageService, public UserService: UserService, public navParams: NavParams) {
    this.currentLanguage = language.getValue();
    this.IsLoggedIn = false;
    this.ShowItem = 1;
    this.resultText = '';
    this.storage.ready().then(() => {
      this.storage.get('FullLookUp').then((val) => {
        for (let i = 0; i < val[0].CategoryTag.length; i++) {
          val[0].CategoryTag[i].IsSelected = false;
        }
        for (let i = 0; i < val[0].CookingTypeTag.length; i++) {
          val[0].CookingTypeTag[i].IsSelected = false;
        }
        for (let i = 0; i < val[0].CusineTag.length; i++) {
          val[0].CusineTag[i].IsSelected = false;
        }

        this.LookUp = val;
        this.storage.get('UserPreferedCategory').then((catVal) => {
          for (let j = 0; j < catVal.length; j++) {
            for (let i = 0; i < val[0].CategoryTag.length; i++) {
              if (catVal[j] == val[0].CategoryTag[i]._id) {
                val[0].CategoryTag[i].IsSelected = true;
                break;
              }
            }
          }
        });
        this.storage.get('UserPreferedCusine').then((cusineVal) => {
          for (let j = 0; j < cusineVal.length; j++) {
            for (let i = 0; i < val[0].CusineTag.length; i++) {
              if (cusineVal[j] == val[0].CusineTag[i]._id) {
                val[0].CusineTag[i].IsSelected = true;
                break;
              }
            }
          }
        });
        this.storage.get('UserPreferedCookingType').then((cookVal) => {
          for (let j = 0; j < cookVal.length; j++) {
            for (let i = 0; i < val[0].CookingTypeTag.length; i++) {
              if (cookVal[j] == val[0].CookingTypeTag[i]._id) {
                val[0].CookingTypeTag[i].IsSelected = true;
                break;
              }
            }
          }
        });        
        this.storage.get('LoggedInUserId').then((val) => {
          
          if (val == null) {
            this.IsLoggedIn = false;
            this.resultText = this.LookUp[0].CategoryTag[0].CategoryNameEn;
          }
          else if (val.length > 0) {
            this.IsLoggedIn = true;
            this.storage.get('LoggedInUserDetails').then((info) => {
              this.profileInfo = info;
              this.userId = info.id;
              this.resultText = this.LookUp[0].CategoryTag[0].CategoryNameEn;
            });
          }
        });
      })
    })    
  }

  AssignPrivate(e) {
    this.storage.ready().then(() => {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src='assets/loading/loading.gif'>`
      });
      loading.present();
      this.storage.get('LoggedInUserId').then((val) => {
        this.UserService.AssignPrivate(val, this.profileInfo.ISPrivate).then((LoggedInUserDetails: any) => {
          this.storage.set('FavList', LoggedInUserDetails.CookBookUserList);
          this.storage.set('LoggedInUserId', LoggedInUserDetails.LoggedInUserDetails.id);
          this.storage.set('LoggedInUserDetails', LoggedInUserDetails.LoggedInUserDetails);
          this.translate.use(LoggedInUserDetails.LoggedInUserDetails.Language);          
          loading.dismiss();
        });
      });
    });
  }

  Logout() {
    this.storage.clear();
    this.app.getRootNav().push('SetPreference');
  }

  ShowItems(item) {
    this.ShowItem = item;
  }

  SHowToastMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    })
    toast.present();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.language.setValue(lang)
    this.currentLanguage = lang;
    this.storage.get('LoggedInUserId').then((val) => {
      this.UserService.ChangeLanguage(val, lang).then((LoggedInUserDetails: any) => {
        debugger;
        this.storage.set('FavList', LoggedInUserDetails.CookBookUserList);
        this.storage.set('LoggedInUserId', LoggedInUserDetails.LoggedInUserDetails.id);
        this.storage.set('LoggedInUserDetails', LoggedInUserDetails.LoggedInUserDetails);
        this.storage.set('language', LoggedInUserDetails.LoggedInUserDetails.Language);
        this.translate.use(LoggedInUserDetails.LoggedInUserDetails.Language);  
      });
    });    
  }

  UpdatePreferences() {
    this.UserPreferedCategory = [];
    for (let i = 0; i < this.LookUp[0].CategoryTag.length; i++) {
      if (this.LookUp[0].CategoryTag[i].IsSelected) {
        this.UserPreferedCategory.push(this.LookUp[0].CategoryTag[i]._id)
      }
    }
    this.UserPreferedCookingType = [];
    for (let i = 0; i < this.LookUp[0].CookingTypeTag.length; i++) {
      if (this.LookUp[0].CookingTypeTag[i].IsSelected)
        this.UserPreferedCookingType.push(this.LookUp[0].CookingTypeTag[i]._id)
    }
    this.UserPreferedCusine = [];
    for (let i = 0; i < this.LookUp[0].CusineTag.length; i++) {
      if (this.LookUp[0].CusineTag[i].IsSelected)
        this.UserPreferedCusine.push(this.LookUp[0].CusineTag[i]._id)
    }
    this.storage.ready().then(() => {
      this.storage.set('UserPreferedCategory', this.UserPreferedCategory);
      this.storage.set('UserPreferedCusine', this.UserPreferedCusine);
      this.storage.set('UserPreferedCookingType', this.UserPreferedCookingType);
      this.storage.set('IsPreserencePageSet', true);
      this.SHowToastMessage("Preferences saved successfully");
    });
  }
}