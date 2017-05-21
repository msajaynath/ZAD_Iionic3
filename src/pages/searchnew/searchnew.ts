import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { searchFilter } from '../Models/RecipieDetailsmodel'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SearchnewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'Search'})
@Component({
  selector: 'page-searchnew',
  templateUrl: 'searchnew.html',
})
export class SearchnewPage {
	callback: any;
	LookUp:  Array<{CategoryTag: Array<{_id: string, CategoryNameEn: string, CategoryNameAr: string, IsSelected: boolean}>,
                CookingTypeTag: Array<{_id: string, CookingTypeNameEn: string, CookingTypeNameAr: string, IsSelected: boolean}>,
                CusineTag: Array<{_id: string, CusineNameEn: string, CusineNameAr: string, IsSelected: boolean}>,
                Time: Array<{_id: string, TimeEn: string, TimeAr: string}>,
                Calories: Array<{_id: string, CaloriesNameEn: string, CaloriesNameAr: string}>}>;

	SelectedTime : string;
	SelectedCalories: string;
	SelectedCategories: string[];
	SelectedCusine: string[];
	SelectedCookingType: string[];
	currentLanguage:string;
	SelectedList: string;
	
  constructor(public navCtrl: NavController, public translate: TranslateService, public storage:Storage, public navParams: NavParams) {
		this.SelectedList = "";
		this.SelectedTime="";
		this.SelectedCalories="";
		this.currentLanguage = this.translate.currentLang;
		this.storage.get('FullLookUp').then((val) => {  
			for(let  i =0; i<val[0].CategoryTag.length; i++){
				val[0].CategoryTag[i].IsSelected = false;
			}
			for(let  i =0; i<val[0].CookingTypeTag.length; i++){
				val[0].CookingTypeTag[i].IsSelected = false;
			}
			for(let  i =0; i<val[0].CusineTag.length; i++){
				val[0].CusineTag[i].IsSelected = false;
			}
			this.LookUp = val; 
			this.SelectedList = "Time";
		});
  }  

	RefineSearchSave() {
		this.SelectedCategories = [];
		this.SelectedCusine = [];
		this.SelectedCookingType = [];

		for(let  i =0; i<this.LookUp[0].CategoryTag.length; i++){
			if(this.LookUp[0].CategoryTag[i].IsSelected)
				this.SelectedCategories.push(this.LookUp[0].CategoryTag[i]._id)
		}
		for(let  i =0; i<this.LookUp[0].CookingTypeTag.length; i++){
			if(this.LookUp[0].CookingTypeTag[i].IsSelected)
				this.SelectedCusine.push(this.LookUp[0].CookingTypeTag[i]._id)
		}
		for(let  i =0; i<this.LookUp[0].CusineTag.length; i++){
			if(this.LookUp[0].CusineTag[i].IsSelected)
				this.SelectedCookingType.push(this.LookUp[0].CusineTag[i]._id)
		}

		let searchfilter = new searchFilter(this.SelectedTime,	this.SelectedCalories,	this.SelectedCategories,
																				this.SelectedCusine,	this.SelectedCookingType);
		this.callback = this.navParams.get("showConfirm")
		this.callback(searchfilter).then(()=>{
				this.navCtrl.pop();
		});		
	}

	SearchItemClick(selectedList){
		this.SelectedList = selectedList;
	}
}


