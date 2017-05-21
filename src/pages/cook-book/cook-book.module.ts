import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CookBookPage } from './cook-book';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    CookBookPage,
  ],
  imports: [
    IonicPageModule.forChild(CookBookPage),TranslateModule.forChild()],
  exports: [
    CookBookPage
  ]
})
export class CookBookPageModule {}
