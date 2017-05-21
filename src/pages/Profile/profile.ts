import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from '../service/UserServices';
import { ProfileDetails, FollowUserInfo } from '../Models/ProfileDetails'
import {TranslateService} from '@ngx-translate/core';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:"Profile"})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [UserService]
})
export class ProfilePage {
  IsViewOtherProfile: boolean;
  profileInfo: ProfileDetails;
  userId: string;
  options: any;
  LoggedInUserDetails: any;
  s3BaseURL: String;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public storage: Storage, public translate: TranslateService, public userServices: UserService, public loadingCtrl: LoadingController, public navParams: NavParams) {
    this.s3BaseURL = "https://s3.ap-south-1.amazonaws.com/zadapp/ProfileImages/";
    this.userId = '';
    this.options = {};
    this.IsViewOtherProfile = false;
    this.IsViewOtherProfile = navParams.get("IsViewOtherProfile");
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src='assets/loading/loading.gif'>`
    });
    loading.present();
    if (this.IsViewOtherProfile) {
      this.storage.get('LoggedInUserId').then((val) => {
        if (navParams.get("UserId") != val) {
          this.userServices.GetUserProfile(navParams.get("UserId"), val).then((profileInfo: any) => {
            this.profileInfo = profileInfo.LoggedInUserDetails;
            this.userId = navParams.get("UserId");
            loading.dismiss();
          })
        }
        else {
          this.IsViewOtherProfile = false;
          this.populateMyData()
          loading.dismiss();
        }
      })
    }
    else {
      this.populateMyData();
      loading.dismiss();
    }
  }

  populateMyData() {
    this.storage.get('LoggedInUserId').then((val) => {
      if (val == null) {
        this.options.PageName = 'Profile';
        this.options.UserId = val;
        this.navCtrl.setPages([
          { page: 'Login', params: { 'params': this.options } }
        ])
      }
      else if (val.length > 0) {
        this.storage.get('LoggedInUserDetails').then((info) => {
          this.profileInfo = info;
          this.userId = info.id;
        });
        this.userServices.GetUserProfile(val, val).then((profileInfo: any) => {
          this.profileInfo = profileInfo.LoggedInUserDetails;
          this.storage.set('LoggedInUserDetails', profileInfo.LoggedInUserDetails);
        })
      }
    });
  }

  MyRecipiesList(event, item) {
    this.navCtrl.push('Recipes', {
      PageName: "Profile",
      ProfileId: this.userId,
      IsViewOtherProfile: this.IsViewOtherProfile
    });
  }

  ViewFollowers() {
    this.navCtrl.push('Followers', {
      PageName: "Profile",
      ProfileId: this.userId
    });
  }

  ViewFollowing() {
    this.navCtrl.push('Following', {
      PageName: "Profile",
      ProfileId: this.userId
    });
  }

  AssignPrivate(e) {
    this.storage.ready().then(() => {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src='assets/loading/loading.gif'>`
      });
      loading.present();
      this.storage.get('LoggedInUserId').then((val) => {
        this.userServices.AssignPrivate(val, this.profileInfo.ISPrivate).then((LoggedInUserDetails: any) => {
          this.LoggedInUserDetails = LoggedInUserDetails;
          this.storage.set('FavList', LoggedInUserDetails.CookBookUserList);
          this.storage.set('LoggedInUserId', LoggedInUserDetails.LoggedInUserDetails.id);
          this.storage.set('LoggedInUserDetails', LoggedInUserDetails.LoggedInUserDetails);
          this.translate.use(LoggedInUserDetails.LoggedInUserDetails.Language);
          loading.dismiss();
        });
      });
    });
  }

  EditProfile(event) {
    this.navCtrl.push('CreateProfile', {
      UserInfo: this.profileInfo,
      pageName: "EditProfile"
    });
  }

  FollowUser() {
    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        if (val == null) {
          this.options.PageName = 'Profile';
          this.options.UserId = val;
          this.navCtrl.setPages([
            { page: 'Login', params: { 'params': this.options } }
          ])
        }
        else if (val.length > 0) {
          this.storage.get('LoggedInUserId').then((info) => {
            this.storage.get('LoggedInUserDetails').then((Details) => {
              let followUserInfo = new FollowUserInfo(this.userId, this.profileInfo.Name, this.profileInfo.JobDescription);
              this.userServices.FollowUser(info,  Details.Name, followUserInfo).then((profileInfo: any) => {
                this.presentToast("User Followed successfully");
                this.profileInfo.IsFollowed = true;
              });
            })
          });
        }
      });
    });
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}


