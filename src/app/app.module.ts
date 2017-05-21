import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpModule, Http} from '@angular/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    
    TranslateModule.forRoot({
      loader:
      {
      provide:TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }
    })
    ,  IonicStorageModule.forRoot() ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
      ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
