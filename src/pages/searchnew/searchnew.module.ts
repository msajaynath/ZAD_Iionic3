import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchnewPage } from './searchnew';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    SearchnewPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchnewPage),TranslateModule.forChild()]
,
  exports: [
    SearchnewPage
  ]
})
export class SearchnewPageModule {}
