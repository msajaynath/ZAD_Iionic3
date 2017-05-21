import { Component } from '@angular/core';
import { IonicPage, ActionSheetController,NavController, NavParams, PopoverController, LoadingController, ToastController } from 'ionic-angular';
import { Recipies } from '../Models/RecipieDetailsmodel'
import { RecipieService } from '../service/RecipieServices';
import { UserService } from '../service/UserServices';
import { CookBookServices } from '../service/CookBookServices';
import { Storage } from '@ionic/storage';
 import { CommonServices } from '../service/generalservices';

/**
 * Generated class for the RecipesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'Recipes'})
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
  providers: [RecipieService, UserService, CookBookServices,CommonServices]

})
export class RecipesPage {
	Recipies: Array<Recipies>;
	pageName: string;
	categoryId: string;
	CookBookRecipeIds: Array<string>;
	cookBookId: string;
	IsSearchClicked: boolean;
	ProfileId: string;
	LikedMsg: string;
	options: any;
	s3BaseURL: String;
	IsViewOtherProfile: boolean
	public IsLoading: boolean;
	LoggedInUserId: string;

	constructor(public actionSheetCtrl: ActionSheetController,public commonServices: CommonServices,  public CookBookServices: CookBookServices, public navCtrl: NavController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public recipieService: RecipieService, public UserService: UserService, public storage: Storage, public navParams: NavParams, public popoverCtrl: PopoverController) {
		this.s3BaseURL = commonServices.profileUrl;
		this.IsLoading = true;
		this.IsSearchClicked = false;
		this.options = {};
		this.pageName = navParams.get("PageName");
		if (this.pageName == "Categories") {
			let loading;
			loading = this.StartLoading(loading)
			this.categoryId = navParams.get("categoryId");
			this.Recipies = [];
			this.recipieService.GetAllRecipiesByCategoryId(this.categoryId).then((Recipies: Array<Recipies>) => {
				this.storage.get('FullLookUp').then((val) => {
					this.getTimeText(val, Recipies);
					loading.dismiss();
					this.IsLoading = false;
				});
			});
		}
		else if (this.pageName == "CookBook") {
			this.CookBookRecipeIds = navParams.get("CookBookRecipeIdId");
			this.cookBookId = navParams.get("CookBookId");
			this.Recipies = [];
			let loading;
			loading = this.StartLoading(loading)
			this.storage.ready().then(() => {
				this.storage.get('LoggedInUserId').then((val) => {
					if (val == null) {
						this.recipieService.GetAllRecipiesByCookBookId('', this.CookBookRecipeIds).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								this.getTimeText(val, Recipies);
								loading.dismiss();
								this.IsLoading = false;

							});
						});
					}
					else if (val.length > 0) {
						this.LoggedInUserId = val;
						this.recipieService.GetAllRecipiesByCookBookId(val, this.CookBookRecipeIds).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								this.getTimeText(val, Recipies);
								loading.dismiss();
								this.IsLoading = false;

							});
						});
					}
				});
			});
		}
		else if (this.pageName == "Profile") {
			let loading;
			loading = this.StartLoading(loading)
			this.ProfileId = navParams.get("ProfileId");
			this.Recipies = [];
			this.storage.ready().then(() => {
				this.storage.get('LoggedInUserId').then((val) => {
					if (val == null) {
						this.recipieService.GetAllRecipiesByUserId("", this.ProfileId).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								this.getTimeText(val, Recipies);
								loading.dismiss();
								this.IsLoading = false;

							});
						});
					}
					else if (val.length > 0) {
						this.LoggedInUserId = val;
						this.recipieService.GetAllRecipiesByUserId(val, this.ProfileId).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								this.getTimeText(val, Recipies);
								loading.dismiss();
								this.IsLoading = false;
							});
						});
					}
				});
			});
		}
	}

	DeleteRecipeFromCookBook(item, index) {
		let loading;
		loading = this.StartLoading(loading)
		this.storage.ready().then(() => {
			this.storage.get('LoggedInUserId').then((val) => {
				if (val.length > 0) {
					let cookBookInfo = new CookBookInfo(item.Id, this.cookBookId, val);
					this.CookBookServices.RemoveRecipieFromCookBook(cookBookInfo).then((info: any) => {									
						this.Recipies.splice(index, 1);			
						this.storage.set('FavList', info.CookBookUserList);
						loading.dismiss();
						this.IsLoading = false;						
					});
				}
			});
		});
	}

	DeleteRecipe(item, index) {
		let loading;
		loading = this.StartLoading(loading)
		this.ProfileId = this.navParams.get("ProfileId");
		this.storage.ready().then(() => {
			this.storage.get('LoggedInUserId').then((val) => {
				if (val == null) {
					this.Recipies.splice(index, 1);
					this.recipieService.DeleteRecipe(item.Id, "", this.ProfileId).then((info: any) => {
						this.storage.get('FullLookUp').then((val) => {
							this.storage.set('LoggedInUserDetails', info.LoggedInUserDetails);
							loading.dismiss();
							this.IsLoading = false;

						});
					});
				}
				else if (val.length > 0) {
					this.Recipies.splice(index, 1);
					this.recipieService.DeleteRecipe(item.Id, val, this.ProfileId).then((info: any) => {
						this.storage.get('FullLookUp').then((val) => {
							this.storage.set('LoggedInUserDetails', info.LoggedInUserDetails);
							loading.dismiss();
							this.IsLoading = false;
						});
					});
				}
			});
		});
	}

	getTimeText(val, Recipies) {
		for (let j = 0; j < Recipies.length; j++) {
			for (let i = 0; i < val[0].Time.length; i++) {
				if (Recipies[j].Time == val[0].Time[i]._id) {
					Recipies[j].Time = val[0].Time[i].CookingTimeEn.replace(/[^\d.]/g, '');
					break;
				}
			}
		}
		this.Recipies = Recipies;
	}

	StartLoading(loading) {
		loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src='assets/loading/loading.gif'>`
		});
		loading.present();
		return loading;
	}

	itemTapped(event, item) {
		this.navCtrl.push('RecipieDetails', {
			Recipie: item
		});
	}

	LikeRecipie(item, RecipieId) {
		this.storage.get('LoggedInUserId').then((val) => {
			if (val == null) {
				this.navCtrl.setPages([
					{ page: 'Login' }
				])
			}
			else if (val.length > 0) {
				this.storage.get('LoggedInUserDetails').then((Details) => {
					this.recipieService.LikeRecipie(val, Details.Name, RecipieId).then((LikedMsg: any) => {
						this.SHowToastMessage("Recipie Liked successfuly");
						item.Liked = true;
						item.TotalLikes = item.TotalLikes + 1;
					})
				})	
			}
		});
	}

	SHowToastMessage(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 2000,
			position: 'top'
		})
		toast.present();
	}

	popover;
	presentPopover(recipieId) {
		this.options.PageName = 'Recipes';
		this.storage.get('LoggedInUserId').then((val) => {
			if (val == null) {
				this.navCtrl.push('Login', {
					params: this.options
				});
			}
			else if (val.length > 0) {
				this.popover = this.popoverCtrl.create('FavouriteList', {
					RecipieId: recipieId,
					closePopup: this.dismissPopup
				});
				this.popover.present();
			}
		});
	}

	dismissPopup = () => {
		return new Promise((resolve, reject) => {
			this.popover.dismiss();
			resolve();
		});
	}

	RecipieOwnerClick(event, profileId) {
		this.navCtrl.push('Profile', {
			IsViewOtherProfile: true,
			UserId: profileId
		});
	}

	myCallbackFunction = (params) => {
		return new Promise((resolve, reject) => {
			this.Recipies = [];
			this.storage.ready().then(() => {
				this.storage.get('LoggedInUserId').then((val) => {
					if (val == null) {
						this.recipieService.GetAllRecipies('', params.Categories, params.Cusine, params.CookingType, params.Time, params.Calories).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								for (let j = 0; j < Recipies.length; j++) {
									for (let i = 0; i < val[0].Time.length; i++) {
										if (Recipies[j].Time == val[0].Time[i]._id) {
											Recipies[j].Time = val[0].Time[i].CookingTimeEn.replace(/[^\d.]/g, '');
											break;
										}
									}
								}
								this.Recipies = Recipies;
							})
						});
					}
					else if (val.length > 0) {
						this.recipieService.GetAllRecipies(val, params.Categories, params.Cusine, params.CookingType, params.Time, params.Calories).then((Recipies: Array<Recipies>) => {
							this.storage.get('FullLookUp').then((val) => {
								for (let j = 0; j < Recipies.length; j++) {
									for (let i = 0; i < val[0].Time.length; i++) {
										if (Recipies[j].Time == val[0].Time[i]._id) {
											Recipies[j].Time = val[0].Time[i].CookingTimeEn.replace(/[^\d.]/g, '');
											break;
										}
									}
								}
								this.Recipies = Recipies;
							})
						});
					}
				});
			});
			resolve();
		});
	}

	GetPrimaryImage(ImageURLs) {
		for (let i = 0; i < ImageURLs.length; i++) {
			if (ImageURLs[i].Order == 0)
				return ImageURLs[i].URL;
		}
	}

	RefineSearchPopover() {
		this.navCtrl.push('Search', {
			showConfirm: this.myCallbackFunction
		});
	}

	SearchClick() {
		this.IsSearchClicked = true;
	}

	onCancel() {
		this.IsSearchClicked = false;
	}


	presentShareActionSheet(recipeTapped) {
		//debugger;
	// 	var imageURLPrimary = this.GetPrimaryImage(recipeTapped.Images);
	// 	var message = recipeTapped.RecipeName + " - " + recipeTapped.RecipeDescription;
	// 	var subject = "ZadApp the recipie app";
	// 	let actionSheet = this.actionSheetCtrl.create({
	// 		title: 'Share via....',
	// 		buttons: [
	// 			{
	// 				text: 'Facebook',
	// 				icon: 'logo-facebook',
	// 				handler: () => {
	// 					SocialSharing.shareViaFacebook(message, imageURLPrimary, null).then(() => {
	// 					}).catch(() => {
	// 						this.SHowToastMessage("Facebook not installed");
	// 					});
	// 				}
	// 			}, {
	// 				text: 'Twitter',
	// 				role: 'destructive',
	// 				icon: 'logo-twitter',
	// 				handler: () => {
	// 					SocialSharing.shareViaTwitter(message, imageURLPrimary, null).then(() => {
	// 					}).catch(() => {
	// 						this.SHowToastMessage("Twitter not installed");
	// 					});
	// 				}
	// 			}, {
	// 				text: 'Instagram',
	// 				role: 'destructive',
	// 				icon: 'logo-instagram',
	// 				handler: () => {
	// 					SocialSharing.shareViaInstagram(message, imageURLPrimary).then(() => {
	// 					}).catch(() => {
	// 						this.SHowToastMessage("Instagram not installed");
	// 					});
	// 				}
	// 			},
	// 			{
	// 				text: 'Whatsapp',
	// 				role: 'destructive',
	// 				icon: 'logo-whatsapp',
	// 				handler: () => {
	// 					SocialSharing.shareViaWhatsApp(message, imageURLPrimary).then(() => {
	// 					}).catch(() => {
	// 						this.SHowToastMessage("Whatsapp not installed");
	// 					});
	// 				}
	// 			},
	// 			{
	// 				text: 'Other',
	// 				role: 'destructive',
	// 				icon: 'share',
	// 				handler: () => {
	// 					SocialSharing.share(message, subject, imageURLPrimary, null).then(() => {
	// 					}).catch(() => {
	// 						this.SHowToastMessage("Error occured!");
	// 					});
	// 				}
	// 			}
	// 		]
	// 	});
	// 	actionSheet.present();

	 }
}

export class CookBookInfo {
	recipeId: string;
	cookbookId: string;
	userId: string;
	constructor(RecipieID: string, CookBookId: string, UserId: string) {
		this.recipeId = RecipieID;
		this.cookbookId = CookBookId;
		this.userId = UserId;
	}
}
