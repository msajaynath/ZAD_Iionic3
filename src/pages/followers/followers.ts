import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController ,App} from 'ionic-angular';
import { GroupDetails } from '../Models/ProfileDetails';
import { UserService } from '../service/UserServices';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the FollowersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'Followers'})
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
    providers: [UserService]

})
export class FollowersPage {
  Followers: Array<GroupDetails>;
  LoggedInUserId: string
  options: any;
  s3BaseURL: String;

  constructor(public navCtrl: NavController, public storage: Storage , public loadingCtrl: LoadingController, public UserService: UserService, public navParams: NavParams, private app: App) {
    this.Followers = [];
    this.s3BaseURL = "https://s3.ap-south-1.amazonaws.com/zadapp/ProfileImages/";
    this.LoggedInUserId = '';
    this.options = {};
       
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
        this.UserService.GetFollowersList(navParams.get("ProfileId")).then((Followers: any) => {
          this.Followers = Followers.Followers;
          this.LoggedInUserId = val;
          loading.dismiss();
        })
      }
    });
  }

  FollowersProfileClicked(event, item) {
    this.app.getRootNav().push('Profile', {
      IsViewOtherProfile: true,
      UserId: item._id
    });
  }
}