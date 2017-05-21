import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetPreference } from './setPreference';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {Http} from '@angular/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [SetPreference],
  imports: [IonicPageModule.forChild(SetPreference) ,TranslateModule.forChild({
      loader:
      {
      provide:TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }
    })],

})
export class SetPreferenceModule { }