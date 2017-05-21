import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddToShoppingListPage } from './add-to-shopping-list';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddToShoppingListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddToShoppingListPage),TranslateModule.forChild()],
  exports: [
    AddToShoppingListPage
  ]
})
export class AddToShoppingListPageModule {}
