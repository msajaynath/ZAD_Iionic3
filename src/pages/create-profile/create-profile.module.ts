import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProfilePage } from './create-profile';
import {TranslateModule} from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    CreateProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateProfilePage),TranslateModule.forChild()
  ],
    providers:[Camera],

  exports: [
    CreateProfilePage
  ]
})
export class CreateProfilePageModule {}
