import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowersPage } from './followers';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    FollowersPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowersPage),TranslateModule.forChild()
  ],
  exports: [
    FollowersPage
  ]
})
export class FollowersPageModule {}
