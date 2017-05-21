import { Component, ViewChild } from '@angular/core';
import {  Slides, NavParams, PopoverController, LoadingController,IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RecipieService } from '../service/RecipieServices';
import { Recipies, Review } from '../Models/RecipieDetailsmodel'
import {TranslateService} from '@ngx-translate/core';
import { CommonServices } from '../service/generalservices';

//import { AddToShoppingList } from '../addtoshoppinglist/AddToShoppingList'

/**
 * Generated class for the RecipiedetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'RecipieDetails'})
@Component({
  selector: 'page-recipiedetails',
  templateUrl: 'recipiedetails.html',
  providers: [RecipieService,CommonServices]

})
export class RecipiedetailsPage {
  subDirection: any;
  directions: Array<{ subDirection: any }>;
  ButtonContent: string;
  directionStyle: string;
  primaryImage: String;
  recipieDetails: Recipies;
  ShowItem: number;
  IsAddNewReview: boolean;
  addReview;
  RecipieId: string;
  s3BaseURL: string;
  ReviewList: any;
  options: {PageName: string, UserId: string};
  
  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;
  reviewRating : number;

  constructor(public navCtrl: NavController,public commonServices: CommonServices, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public storage: Storage, public recipieService: RecipieService, public navParams: NavParams, public translate: TranslateService) {
    this.s3BaseURL = commonServices.profileUrl;
    this.primaryImage = "";
    this.ShowItem = 1;
    this.IsAddNewReview = false;
    this.addReview = new Review('','' , '', '', '', 0, '');
    this.ReviewList = [];
    this.selectedSegment = 'first';
    this.slides = [
      {
        id: "first",
        title: "First Slide"
      },
      {
        id: "second",
        title: "Second Slide"
      },
      {
        id: "third",
        title: "Third Slide"
      },
      {
        id: "forth",
        title: "Forth Slide"
      }
    ];

    if(navParams.get("PageName") == "ShoppingList"){
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src='assets/loading/loading.gif'>`
      });
      loading.present();
      this.recipieService.GetRecipeById(navParams.get("recipeId")).then((Recipies: Recipies) => {
        this.recipieDetails = Recipies;
        this.populateRecipeDetails()
        loading.dismiss();
      })
    }
    else{
      this.recipieDetails = navParams.get("Recipie");   
      this.populateRecipeDetails()
    }     
  }

  populateRecipeDetails(){
    this.reviewRating = 0
    if( this.recipieDetails.RatingCount > 0)
      this.reviewRating = this.recipieDetails.RatingValue / this.recipieDetails.RatingCount

    this.storage.ready().then(() => {
      this.storage.get('UserShoppingList').then((val) => {
        if(val != null){
          let shoppingList = []
          for(let i = 0; i< val.length; i++){
            if(val[i].recipeId == this.recipieDetails.Id)
              shoppingList.push(val[i]);
          }
          for (let i = 0; i < this.recipieDetails.Ingredents.length; i++) {
            for(let j = 0; j< shoppingList.length; j++){
              if(this.recipieDetails.Ingredents[i]._id == shoppingList[j].recipeIngredentId)
                this.recipieDetails.Ingredents[i].isAddedInShoppingCart = true
            }
          }
        }
      });
    }); 

    this.directions = [];
    for (let i = 0; i < this.recipieDetails.Directions.length; i++) {
      if (this.recipieDetails.Directions[i].includes("\n")) {
        this.subDirection = [];
        var step = this.recipieDetails.Directions[i].split("\n");
        for (let j = 0; j < step.length; j++) {
          this.subDirection.push({ Text: step[j] });
        }
        this.directions.push({
          subDirection: this.subDirection
        })
      }
      else {
        this.directions.push({
          subDirection: [{
            Text: this.recipieDetails.Directions[i]
          }]
        })
      }
    }
    for (let i = 0; i < this.recipieDetails.Images.length; i++) {
      if (this.recipieDetails.Images[i].Order == 0)
        this.primaryImage = this.recipieDetails.Images[i].URL
    }

    this.storage.get('FullLookUp').then((val) => {
      if (val.length > 0) {
        if (val[0].CategoryTag != null) {
          for (let p = 0; p < val[0].CategoryTag.length; p++) {
            if (val[0].CategoryTag[p]._id == this.recipieDetails.Category) {
              this.recipieDetails.Category = val[0].CategoryTag[p].CategoryNameEn;
            }
          }
        }
        if (val[0].CookingTypeTag != null) {
          for (let p = 0; p < val[0].CookingTypeTag.length; p++) {
            if (val[0].CookingTypeTag[p]._id == this.recipieDetails.CookingType) {
              this.recipieDetails.CookingType = val[0].CookingTypeTag[p].CookingTypeNameEn;
            }
          }
        }
        if (val[0].CusineTag != null) {
          for (let p = 0; p < val[0].CusineTag.length; p++) {
            if (val[0].CusineTag[p]._id == this.recipieDetails.Cusine) {
              this.recipieDetails.Cusine = val[0].CusineTag[p].CusineNameEn;
            }
          }
        }
      }
    });
  }

  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide != null) {
      if (currentSlide.hasOwnProperty('id'))
        this.selectedSegment = currentSlide.id;
      else
        this.selectedSegment = "forth";
    }
    else
      this.selectedSegment = "forth";
    this.RefreshReviews(this.selectedSegment);
  }

  popover;
  shoppingListInfo;
	ingredentSelected(recipieIngredent) {
		this.storage.get('LoggedInUserId').then((val) => {
			if (val == null) {
        let loginParams = new LoginParams('RecipeDetails', val)
        this.navCtrl.push('Login', {
          params: loginParams
        });
			}
			else if (val.length > 0) {
        this.shoppingListInfo = {};
        this.shoppingListInfo.RecipeId = this.recipieDetails.Id;
        this.shoppingListInfo.RecipeName = this.recipieDetails.RecipeName;
        this.shoppingListInfo.RecipeImageUrl = this.primaryImage;
        this.shoppingListInfo.IngredentId = recipieIngredent._id;
        this.shoppingListInfo.IngredentName = recipieIngredent.Name;

				this.popover = this.popoverCtrl.create('AddToShoppingList', {
					shoppingListInfo: this.shoppingListInfo,
					closePopup: this.dismissIngredentPopup
				});
				this.popover.present();
			}
		});
	}

  dismissIngredentPopup = (AddShoppingListinfo) => {
		return new Promise((resolve, reject) => {
      for (let i = 0; i < this.recipieDetails.Ingredents.length; i++) {
        if(this.recipieDetails.Ingredents[i]._id == AddShoppingListinfo.IngredentId)
          this.recipieDetails.Ingredents[i].isAddedInShoppingCart = true;        
      }
			this.popover.dismiss();
			resolve();
		});
	}

 

  SaveReviewDetails() {    
    this.addReview.RecipeId = this.recipieDetails.Id
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    this.addReview.ReviewedDate = month + "/" + day + "/" + year;
    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        if (val == null) {
          this.options.PageName = 'RecipeDetails';
          this.options.UserId = val;
          this.navCtrl.push('Login', {
            params: this.options
          });
        }
        else if (val.length > 0) {
          this.storage.ready().then(() => {
            let loading = this.loadingCtrl.create({
              spinner: 'hide',
              content: `<img src='assets/loading/loading.gif'>`
            });
            loading.present();
            this.addReview.ReviewerId = val;
            this.storage.get('LoggedInUserDetails').then((UserDetails) => {
              this.addReview.ReviewerName = UserDetails.Name;
              this.recipieService.AddReview(this.addReview).then((reviews: any) => {
                if(reviews != null){
                  if(this.addReview._id == "")
                    this.ReviewList.push(reviews.UserReview);
                  else{
                    for(let i = 0; i< this.ReviewList.length;i++){
                      if(this.ReviewList[i].ReviewerId == val){
                        this.ReviewList.splice(i, 1);  //pop();
                        this.ReviewList.push(reviews.UserReview);
                      }
                    }
                  }
                  if( parseInt(reviews.RatingCount) > 0)
                    this.reviewRating = parseInt(reviews.RatingValue) / parseInt(reviews.RatingCount);
                }
                this.addReview = new Review('','', '', '', '', 0, '');
                this.IsAddNewReview = false;
                loading.dismiss();
              })
            })  
          });
        }
      })
    })
  }

  AddNewReview() {
    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {
        if (val == null) {
          let loginParams = new LoginParams('RecipeDetails', val)
          this.navCtrl.push('Login', {
            params: loginParams
          });
        }
        else if (val.length > 0) 
        {          
          this.IsAddNewReview = true;
          for(let i = 0; i< this.ReviewList.length; i++)
          {
            if(this.ReviewList[i].ReviewerId == val)
            {
              this.addReview = new Review(this.ReviewList[i]._id, this.ReviewList[i].RecipeId, this.ReviewList[i].ReviewerId, this.ReviewList[i].ReviewerName, this.ReviewList[i].ReviewedDate, this.ReviewList[i].ReviewRating, this.ReviewList[i].ReviewDescription);
            }
          }
        }
      })
    })    
  }

  CloseAddNewReview() {
    this.IsAddNewReview = false;
  }

  RefreshReviews(item) {
    if (item == "third") {
      this.storage.ready().then(() => {
        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<img src='assets/loading/loading.gif'>`
        });
        loading.present();
        this.storage.get('LoggedInUserId').then((val) => {
          this.recipieService.GetAllReviews(val, this.recipieDetails.Id ).then((ReviewList: any) => {
            this.ReviewList = ReviewList.ReviewInfo[0].Reviews;
            loading.dismiss();
          })
        })
      });
    }
  }

  RecipieOwnerClick(event, profileId) {
    this.navCtrl.push('Profile', {
      IsViewOtherProfile: true,
      UserId: profileId
    });
  }
}

export class LoginParams {
  PageName       : string;
	UserId				: string;
	constructor( PageName : string, UserId 	: string) {
    this.PageName = PageName;
		this.UserId = UserId;								
	}	
}
