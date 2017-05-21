import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {Http} from '@angular/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}@NgModule({
  declarations: [
    CategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),TranslateModule.forChild({
      loader:
      {
      provide:TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }
    })]
})
export class CategoriesPageModule {}
