import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { UserService } from '../service/UserServices';
import {TranslateService} from '@ngx-translate/core';
import { LanguageService } from '../service/language';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'Login'})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
    providers: [UserService,LanguageService]
})
export class LoginPage {
  email: string;
  password: string;
  LoggedInUserDetails: any;
  IsNetworkAvailable: boolean;
  invokedPageDetails: any;

  constructor( public loadingCtrl: LoadingController, public navCtrl: NavController, public translate: TranslateService, public language: LanguageService, public storage: Storage, public userServices: UserService, public navParams: NavParams) {
    this.invokedPageDetails = navParams.get("params");
    
        this.IsNetworkAvailable = true;
     
  }


  Login() {
    this.storage.ready().then(() => {

      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src='assets/loading/loading.gif'>`
      });
      loading.present();
      if (this.IsNetworkAvailable) {
        this.userServices.LoginValidation(this.email, this.password).then((LoggedInUserDetails: any) => {
          this.LoggedInUserDetails = LoggedInUserDetails;

          if (this.LoggedInUserDetails.status == true) {
            this.storage.set('FavList', LoggedInUserDetails.CookBookUserList);
            this.storage.set('LoggedInUserId', LoggedInUserDetails.LoggedInUserDetails.id);
            this.storage.set('LoggedInUserDetails', LoggedInUserDetails.LoggedInUserDetails);

            this.storage.set('UserShoppingCart', LoggedInUserDetails.ShoppingCart);
            this.storage.set('UserShoppingList', LoggedInUserDetails.ShoppingList);

            this.translate.use(LoggedInUserDetails.LoggedInUserDetails.Language);
            this.language.setValue(LoggedInUserDetails.LoggedInUserDetails.Language)
            var root = this;
            setTimeout(function () {
              if (root.invokedPageDetails.PageName == 'Profile')
                root.navCtrl.setPages([{ page: 'Profile' }])
              else if (root.invokedPageDetails.PageName == 'Groups')
                root.navCtrl.setPages([{ page: 'Groups' }])
              else if (root.invokedPageDetails.PageName == 'CookBook')
                root.navCtrl.setPages([{ page: 'CookBook' }])
              else if (root.invokedPageDetails.PageName == 'CreateRecipie')              
                root.navCtrl.setPages([{ page: 'CreateRecipie' }])              
              else if (root.invokedPageDetails.PageName == 'Home') 
                root.navCtrl.pop(); 
              else if (root.invokedPageDetails.PageName == 'Recipes') 
                root.navCtrl.pop();   
              else if (root.invokedPageDetails.PageName == 'RecipeDetails')
                root.navCtrl.pop();  
              else if (root.invokedPageDetails.PageName == 'ShoppingList')
                root.navCtrl.pop();  
              else
                root.navCtrl.setPages([{ page: 'Home' }])
              loading.dismiss();
            }, 1000)
          }
          else {
            alert(this.LoggedInUserDetails.message);
            loading.dismiss();
          }
        });
      }
      else {
        alert("No Network")
        loading.dismiss();
      }
    });
  }

  GoToHome() {
    this.navCtrl.setPages([
      { page: 'Home' }
    ])

  }

  createAccount() {
    this.navCtrl.push('CreateProfile', {
      UserId: '',
      page: "Create Profile"
    });
  }
}