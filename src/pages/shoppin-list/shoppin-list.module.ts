import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppinListPage } from './shoppin-list';
import {TranslateModule} from '@ngx-translate/core';
@NgModule({
  declarations: [
    ShoppinListPage,
  ],
  imports: [
    IonicPageModule.forChild(ShoppinListPage),TranslateModule.forChild()],
  exports: [
    ShoppinListPage
  ]
})
export class ShoppinListPageModule {}
