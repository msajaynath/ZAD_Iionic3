export class RecipieDetailsModel {
  Id                  : String;
	RecipeName					: String;		
	RecipeDescription		: String;
	MakerId		     			: String;
	MakerName     			: String;
	MakerImage					: String;
	Time								: String;
	Ingredents    			: Array<string>;
	Directions    			: Array<string>;
	Rating      				: Number;  
	Calories      			: String;    
	PhotosList					: Array<{s3Url: string, isPrimary: boolean}>;
	Category     				: String;
	CookingType      		: String;
	Cusine							: String;
  Reviews  						: [Review];
	constructor(Id : String,RecipeName: String,	RecipeDescription	: String,	MakerId : String, MakerName : String, 
							MakerImage : String, Time: String,
							Ingredents : Array<string>,	Directions : Array<string>,	Rating : Number,  
							Calories : String, 	PhotosList : Array<{s3Url: string, isPrimary: boolean}>,	
							Category : String,	CookingType	: String, Cusine: String, Reviews  : [Review]) {
		this.RecipeName = RecipeName;
		this.RecipeDescription = RecipeDescription;
		this.MakerId = MakerId
		this.MakerName = MakerName;						
		this.Time = Time;
		this.Ingredents = Ingredents;
		this.Directions = Directions;
		this.Rating = Rating;
		this.Calories = Calories;
		this.PhotosList = PhotosList;
		this.Category = Category;		
		this.CookingType = CookingType;
		this.Cusine = Cusine;
	}
}

export class Review {
	_id										: string
	RecipeId							: string
  ReviewerId            : String;
  ReviewerName     			: String; 
  ReviewedDate      		: String;
  ReviewRating      		: Number;
  ReviewDescription     : String;
	constructor(_id: string, RecipeId: string, ReviewerId: string, ReviewerName : String,  ReviewedDate : String,  ReviewRating 	: Number,
  						ReviewDescription : String) {
		this._id = _id;								
		this.RecipeId = RecipeId;
		this.ReviewerId = ReviewerId;
		this.ReviewerName = ReviewerName;
		this.ReviewedDate = ReviewedDate;
		this.ReviewRating = ReviewRating;						
		this.ReviewDescription = ReviewDescription;
	}	
}

export class Recipies{
	Id : string;
	RecipeName: string; 
	RecipieDescription: string; 
	Time: string; 
	Liked: boolean;
	MakerId: string;
	MakerName: string;
	TotalLikes: number;
	Ingredents: Array<{_id: string, Name: string, isAddedInShoppingCart: boolean}>;
	Directions: Array<string>;
	RatingValue:number;
	RatingCount: number;
	Calories: String;
	Images: [{
		URL: String,
		Order: Number,
		Type: String
	}];
	Videos: [{
		URL: String,
		Order: Number,
		Type: String
	}];
	Category: String;
	Language: String;
	CookingType: String;
	Cusine: String;
	Reviews: Array<Review>;
}

export class searchFilter {
	Time :string;
	Calories :string;
	Categories : string[];
	Cusine : string[];
	CookingType : string[];
	constructor(Time: string, Calories: string, Categories:string[], Cusine: string[], CookingType: string[]) {
		this.Time = Time;
		this.Calories = Calories;
		this.Categories = Categories;
		this.Cusine = Cusine;
		this.CookingType = CookingType;
	}
}


