import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ErrorDialogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'ErrorDialog'})
@Component({
  selector: 'page-error-dialog',
  templateUrl: 'error-dialog.html',
})
export class ErrorDialogPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }
close()
{
  this.navCtrl.pop();
}

}
