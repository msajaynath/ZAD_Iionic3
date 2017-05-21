import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorDialogPage } from './error-dialog';

@NgModule({
  declarations: [
    ErrorDialogPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorDialogPage),
  ],
  exports: [
    ErrorDialogPage
  ]
})
export class ErrorDialogPageModule {}
