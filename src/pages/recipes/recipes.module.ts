import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipesPage } from './recipes';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipesPage),TranslateModule.forChild()
  ],
  exports: [
    RecipesPage
  ]
})
export class RecipesPageModule {}
