import { Component,ViewChild } from '@angular/core';
import { Nav,Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import { LanguageService } from '../pages/service/language';

@Component({
  templateUrl: 'app.html',
  providers: [LanguageService]

})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

  rootPage:any = 'SetPreference';
  pages: Array<{title: string,page: string, icon:string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public translate: TranslateService, public language: LanguageService) {
    platform.ready().then(() => {
      //translate.setDefaultLang("en");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pages = [
      { title: 'Home', page:"Home",icon:"home" },
      { title: 'Categories', page:"Categories",icon:"restaurant" },
      { title: 'My Cookbook', page:"CookBook",icon:"bookmarks" },
      { title: 'My Profile',  page:"Profile",icon:"contact"},
      { title: 'Shopping List', page:"ShoppingList", icon:"basket" },
      { title: 'Create Recipe',  page:"CreateRecipie",icon:"add-circle"},
      { title: 'Notifications', page:"Notifications",icon:"notifications" },
      { title: 'Settings', page:"Settings",icon:"settings" }
    ];

      
  });
 // translate.setDefaultLang(language.getValue());

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title=='Home')
    {
    this.nav.setRoot(page.page);
  }
  else{
        this.nav.push(page.page);

  }
  }
}

