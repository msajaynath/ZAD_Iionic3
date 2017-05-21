import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserService } from '../service/UserServices';
import { Storage } from '@ionic/storage';

@IonicPage({name:'Notifications'})
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
  providers: [UserService]

})
export class NotificationsPage{
  Notifications: any;
  s3BaseURL: string;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public storage: Storage, public UserService: UserService, public navParams: NavParams) {
    this.s3BaseURL = "https://s3.ap-south-1.amazonaws.com/zadapp/ProfileImages/";
    this.Notifications = [];

    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        if (val == null) {
          this.navCtrl.setPages([
            { page: 'Login' }
          ])
        }
        else if (val.length > 0) {
           let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src='assets/loading/loading.gif'>`
          });
          loading.present();
          this.UserService.GetNotifications(val).then((info: any) => {
            this.Notifications = info;            
            for (let i = 0; i < this.Notifications.length; i++) {
              if (this.Notifications[i].category == 1)
                this.Notifications[i].CategoryText = "has created a new recipe";
              else if (this.Notifications[i].category == 2)
                this.Notifications[i].CategoryText = "has wrote a review to your recipe";
              else if (this.Notifications[i].category == 3)
                this.Notifications[i].CategoryText = "has liked your recipe";
              else if (this.Notifications[i].category == 4)
                this.Notifications[i].CategoryText = "is now following you";
            }
            loading.dismiss();
          })
        }
      });
    });
  }
  DeleteNotification(item, index) {
    this.UserService.ArchiveNotifications(item.id).then((info: any) => {      
      this.Notifications.splice(index, 1);	
    })
  }

  ViewRecipe(id){
    this.navCtrl.push('RecipieDetails', {
			recipeId: id,
      PageName: 'ShoppingList'
		});
  }

  ViewProfile(id){
    this.navCtrl.push('Profile', {
			IsViewOtherProfile: true,
			UserId: id
		});
  }
}