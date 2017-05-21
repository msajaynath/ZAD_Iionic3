import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ActionSheetController, NavController, NavParams, PopoverController, LoadingController, ToastController,IonicPage } from 'ionic-angular';
import { Recipies } from '../Models/RecipieDetailsmodel'
import { RecipieService } from '../service/RecipieServices';
 import { UserService } from '../service/UserServices';
 import { CommonServices } from '../service/generalservices';

// import { SocialSharing } from 'ionic-native';
@IonicPage()

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [RecipieService, UserService,CommonServices]
})
export class Home {
	Recipies: Array<Recipies>;
	pageName: string;
	categoryId: string;
	CookBookRecipeIds: Array<string>;
	IsSearchClicked: boolean;
	ProfileId: string;
	LikedMsg: string;
	options: any;
	s3BaseURL: String;
	IsViewOtherProfile: boolean
	public IsLoading: boolean;
	loading: any;
	showRibbon: boolean;

	constructor(public actionSheetCtrl: ActionSheetController,public commonServices: CommonServices, public navCtrl: NavController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public recipieService: RecipieService, public UserService: UserService, public storage: Storage, public navParams: NavParams, public popoverCtrl: PopoverController, public translate: TranslateService) {
		this.showRibbon = true;
		this.s3BaseURL = commonServices.profileUrl;
		this.IsLoading = true;
		this.IsSearchClicked = false;
		this.options = {};
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src='assets/loading/loading.gif'>`
		});
										

		this.loading.present();
		this.Recipies = [];
		this.storage.ready().then(() => {
			this.storage.get('UserPreferedCategory').then((catVal) => {
				this.storage.get('UserPreferedCusine').then((cusineVal) => {
					this.storage.get('UserPreferedCookingType').then((cookVal) => {
						this.storage.get('LoggedInUserId').then((val) => {
							if (val == null) {
								this.recipieService.GetAllRecipies('', catVal, cusineVal, cookVal, '', ' allrecipes').then((Recipies: Array<Recipies>) => {
									this.storage.get('FullLookUp').then((val) => {
										this.getTimeText(val, Recipies);
										this.loading.dismiss();
										this.IsLoading = false;

									})
								}).catch(error=>{
								this.loading.dismiss();
								this.IsLoading = false;
								this.popover = this.popoverCtrl.create('ErrorDialog', {});
								this.popover.present();								
							});
							}
							else if (val.length > 0) {
								this.recipieService.GetAllRecipies(val, catVal, cusineVal, cookVal, '', ' allrecipes').then((Recipies: Array<Recipies>) => {

									this.storage.get('FullLookUp').then((val) => {
										this.getTimeText(val, Recipies);
										this.loading.dismiss();
										this.IsLoading = false;
									})
								})
								////catch here
								.catch(error=>{
								this.loading.dismiss();
								this.IsLoading = false;
								this.popover = this.popoverCtrl.create('ErrorDialog', {});
								this.popover.present();								
							});
							}
						});
					})
				})
			})
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

	doInfinite(infiniteScroll) {
		this.storage.get('UserPreferedCategory').then((catVal) => {
			this.storage.get('UserPreferedCusine').then((cusineVal) => {
				this.storage.get('UserPreferedCookingType').then((cookVal) => {
					this.recipieService.GetAllRecipies('', catVal, cusineVal, cookVal, '', '').then((Recipies: Array<Recipies>) => {
						this.storage.get('FullLookUp').then((val) => {
							for (let j = 0; j < Recipies.length; j++) {
								for (let i = 0; i < val[0].Time.length; i++) {
									if (Recipies[j].Time == val[0].Time[i]._id) {
										Recipies[j].Time = val[0].Time[i].CookingTimeEn.replace(/[^\d.]/g, '');
										break;
									}
								}
								this.Recipies.push(Recipies[j]);
							}
						})
						infiniteScroll.complete();
					});
				})
			})
		})
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
		this.options.PageName = 'Home';
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
					let loading1 = this.loadingCtrl.create({
						spinner: 'hide',
						content: `<img src='assets/loading/loading.gif'>`
					});
					loading1.present();

					this.IsLoading = true;
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
								loading1.dismiss();
								this.IsLoading = false;
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
								loading1.dismiss();
								this.IsLoading = false;
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
		// var imageURLPrimary = this.GetPrimaryImage(recipeTapped.Images);
		// var message = recipeTapped.RecipeName + " - " + recipeTapped.RecipeDescription;
		// var subject = "ZadApp the recipie app";
		// let actionSheet = this.actionSheetCtrl.create({
		// 	title: 'Share via....',
		// 	buttons: [
		// 		{
		// 			text: 'Facebook',
		// 			icon: 'logo-facebook',
		// 			handler: () => {
		// 				SocialSharing.shareViaFacebook(message, imageURLPrimary, null).then(() => {
		// 				}).catch(() => {
		// 					this.SHowToastMessage("Facebook not installed");
		// 				});
		// 			}
		// 		}, {
		// 			text: 'Twitter',
		// 			role: 'destructive',
		// 			icon: 'logo-twitter',
		// 			handler: () => {
		// 				SocialSharing.shareViaTwitter(message, imageURLPrimary, null).then(() => {
		// 				}).catch(() => {
		// 					this.SHowToastMessage("Twitter not installed");
		// 				});
		// 			}
		// 		}, {
		// 			text: 'Instagram',
		// 			role: 'destructive',
		// 			icon: 'logo-instagram',
		// 			handler: () => {
		// 				SocialSharing.shareViaInstagram(message, imageURLPrimary).then(() => {
		// 				}).catch(() => {
		// 					this.SHowToastMessage("Instagram not installed");
		// 				});
		// 			}
		// 		},
		// 		{
		// 			text: 'Whatsapp',
		// 			role: 'destructive',
		// 			icon: 'logo-whatsapp',
		// 			handler: () => {
		// 				SocialSharing.shareViaWhatsApp(message, imageURLPrimary).then(() => {
		// 				}).catch(() => {
		// 					this.SHowToastMessage("Whatsapp not installed");
		// 				});
		// 			}
		// 		},
		// 		{
		// 			text: 'Other',
		// 			role: 'destructive',
		// 			icon: 'share',
		// 			handler: () => {
		// 				SocialSharing.share(message, subject, imageURLPrimary, null).then(() => {
		// 				}).catch(() => {
		// 					this.SHowToastMessage("Error occured!");
		// 				});
		// 			}
		// 		}
		// 	]
		// });
		// actionSheet.present();

	}


	onSearchInput(search) {
		this.showRibbon = false;
		let searchQuery = search.srcElement.value;
		this.IsLoading = true;
		let loadings = this.loadingCtrl.create({
			spinner: 'hide',
			content: `<img src='assets/loading/loading.gif'>`
		});
		loadings.present();
		this.Recipies = [];
		this.storage.ready().then(() => {
			this.storage.get('LoggedInUserId').then((val) => {
				if (val == null) {
					this.recipieService.GetRecipiesFromSearch('', searchQuery).then((Recipies: Array<Recipies>) => {
						this.storage.get('FullLookUp').then((val) => {
							this.getTimeText(val, Recipies);
							loadings.dismiss();
							this.IsLoading = false;
						})
					});
				}
				else if (val.length > 0) {
					this.recipieService.GetRecipiesFromSearch(val, searchQuery).then((Recipies: Array<Recipies>) => {
						this.storage.get('FullLookUp').then((val) => {
							this.getTimeText(val, Recipies);
							loadings.dismiss();
							this.IsLoading = false;
						})
					});
				}
			});
		});
	}
}
