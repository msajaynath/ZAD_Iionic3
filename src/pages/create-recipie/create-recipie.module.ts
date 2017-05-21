import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRecipiePage } from './create-recipie';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { VideoEditor } from '@ionic-native/video-editor';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateRecipiePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRecipiePage),TranslateModule.forChild()],
  providers:[VideoEditor,Camera,ImagePicker],
  exports: [
    CreateRecipiePage
  ]
})
export class CreateRecipiePageModule {}
