import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipiedetailsPage } from './recipiedetails';
import { Ionic2RatingModule } from 'ionic2-rating';
import {MomentModule} from 'angular2-moment';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecipiedetailsPage,
  ],
  imports: [Ionic2RatingModule,
    IonicPageModule.forChild(RecipiedetailsPage),MomentModule
    ,TranslateModule.forChild()
  ],
  exports: [
    RecipiedetailsPage
  ]
})
export class RecipiedetailsPageModule {}
