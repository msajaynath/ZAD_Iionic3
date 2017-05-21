import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,App } from 'ionic-angular';
import { GroupDetails } from '../Models/ProfileDetails';
import { UserService } from '../service/UserServices';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the FollowingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'Following'})
@Component({
  selector: 'page-following',
  templateUrl: 'following.html',
    providers: [UserService]

})
export class FollowingPage {
  Followings: Array<GroupDetails>;
  LoggedInUserId: string
  options: any;
  s3BaseURL: String;

  constructor(public navCtrl: NavController , public loadingCtrl: LoadingController , public storage: Storage, public UserService: UserService, public navParams: NavParams, private app: App) {
    this.Followings = [];
    this.LoggedInUserId = '';
    this.options = {};
    this.s3BaseURL = "https://s3.ap-south-1.amazonaws.com/zadapp/ProfileImages/";
    this.storage.get('LoggedInUserId').then((val) => {
      if (val == null) {
        this.options.PageName = 'Groups';
        this.options.UserId = val;
        this.navCtrl.setPages([
          { page: 'Login', params: { 'params': this.options } }
        ])
      }
      else if (val.length > 0) {
        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<img src='assets/loading/loading.gif'>`
        });
        loading.present();
        this.UserService.GetFollowingList(navParams.get("ProfileId")).then((Followings: any) => {
          this.Followings = Followings.Following;
          this.LoggedInUserId = val;
          loading.dismiss();
        })
      }
    });
  }

  FollowingProfileClicked(event, item) {
    this.app.getRootNav().push('Profile', {
      IsViewOtherProfile: true,
      UserId: item._id
    });
  }
}