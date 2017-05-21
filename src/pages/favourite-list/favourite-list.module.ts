import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavouriteListPage } from './favourite-list';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    FavouriteListPage,
  ],
  imports: [
    IonicPageModule.forChild(FavouriteListPage),TranslateModule.forChild()],
  exports: [
    FavouriteListPage
  ]
})
export class FavouriteListPageModule {}
