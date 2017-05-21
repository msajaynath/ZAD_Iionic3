import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { AppSettings } from './generalservices';

@Injectable()
export class RecipieService {
	constructor(private http: Http) { }

	SaveRecipie(RecipieInfo) {
		return new Promise(resolve => {
			this.http.post(AppSettings.RecipeServiceUrl + 'create', RecipieInfo)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetRecipeById(recipeId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.RecipeServiceUrl + 'getRecipeById/' + recipeId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	AddReview(ReviewInfo) {
		return new Promise(resolve => {
			this.http.post(AppSettings.RecipeServiceUrl + 'addreview', ReviewInfo)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetAllReviews(UserId, RecipeId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.RecipeServiceUrl + 'GetAllReview?UserId=' + UserId + '&RecipeId=' + RecipeId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	LikeRecipie(userId, name, recipeId) {
		return new Promise(resolve => {
			this.http.post(AppSettings.RecipeServiceUrl + 'like', { userId: userId, name: name, recipeId: recipeId })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	DeleteRecipe(recipeId: string, userId: string, makerId: string) {
		return new Promise(resolve => {
			this.http.post(AppSettings.RecipeServiceUrl + 'archiveRecipeById', { recipeId: recipeId, userId: userId, makerId: makerId })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					debugger;
					console.log("Oooops!");
					resolve(error.json())
				});
		});
	}

	GetAllRecipies(userid: string, Categories: Array<string>, Cusines: Array<string>, CookingType: Array<string>, time: string, calories: string) {
		let search;
		if (Categories.length == 0 && Cusines.length == 0 && CookingType.length == 0 && time.length == 0 && calories.length == 0) {
			search = '';
		}
		else {
			search = [];
			search = search.concat(Categories, Cusines, CookingType, time, calories);

		}
		return new Promise((resolve,reject) => {
			this.http.get(AppSettings.RecipeServiceUrl + 'getAllRecipes?search=' + search + '&userid=' + userid)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
				///////reject promise
				reject();
				});
		});

	}
	GetRecipiesFromSearch(userid: string, search: string) {
		return new Promise(resolve => {
			this.http.get(AppSettings.RecipeServiceUrl + 'getAllRecipes?usersearch=' + search + '&userid=' + userid)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetAllRecipiesByUserId(userId: string, makerId: string) {
		return new Promise(resolve => {
			this.http.get(AppSettings.RecipeServiceUrl + 'getRecipeByMaker?userId=' + userId + '&makerId=' + makerId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetAllRecipiesByCookBookId(userId: string, CookBookRecipeIds: Array<string>) {
		return new Promise(resolve => {
			this.http.post(AppSettings.RecipeServiceUrl + 'getRecipeByCookBook', { UserId: userId, RecipeId: CookBookRecipeIds })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetAllRecipiesByCategoryId(CategoryId: string) {
		let search = [];
		search.push(CategoryId);
		return new Promise(resolve => {
			this.http.get(AppSettings.RecipeServiceUrl + 'getAllRecipes?search=' + search)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}
}