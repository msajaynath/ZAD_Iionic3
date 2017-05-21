import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the CookBookPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'CookBook'})
@Component({
  selector: 'page-cook-book',
  templateUrl: 'cook-book.html',
})
export class CookBookPage {
	cookBook: Array<{ Title: string, NoOfRecipies: number, ImageUrl: string }>;
	options: any;
	CookBookList: any
	ACookBookImage : string;

	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public storage: Storage, public navParams: NavParams) {
		this.options = {};
		this.ACookBookImage = '';
		this.storage.get('LoggedInUserId').then((val) => {
			if (val == null) {
				this.options.PageName = 'CookBook';
				this.options.UserId = val;
				this.navCtrl.setPages([
					{ page: 'Login', params: { 'params': this.options } }
				])
			}
			else if (val.length > 0) {
				this.storage.ready().then(() => {
					let loading = this.loadingCtrl.create({
						spinner: 'hide',
						content: `<img src='assets/loading/loading.gif'>`
					});
					loading.present();
					this.storage.get('FavList').then((val) => {
						this.CookBookList = val;
						this.ACookBookImage = this.CookBookList[0].ImageUrl;
						loading.dismiss();
					})
				});				
			}
		});
	}

	CookBookClicked(event, item) {
		if(item.RecipeId.length > 0){
			this.navCtrl.push('Recipes', {
				PageName: "CookBook",
				CookBookId: item._id,
				CookBookRecipeIdId : item.RecipeId
			});
		}
	}
}
