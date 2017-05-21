import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),MomentModule
  ],
  exports: [
    NotificationsPage
  ]
})
export class NotificationsPageModule {}
