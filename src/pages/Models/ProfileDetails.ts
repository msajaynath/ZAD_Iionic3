export class ProfileDetails {
    Name	        : String;
    id	        : String;
    JobDescription     	: String;
    Followers	        : number;
    Following    	: number;
    UserRecipies    	: number;
    ISPrivate      	: Boolean;  
    Language      	: String;    
    Email    		: String;
    PhoneNumber     	: String;
    LikedRecipies      	: number;
    IsFollowed      :  boolean;

    constructor(Name : String, JobDescription  : String,   Followers : number, Following : number,
                UserRecipies  : number, ISPrivate: Boolean, Language : String,  Email  : String,
                PhoneNumber : String, LikedRecipies  : number) {
        this.Name = Name;
        this.JobDescription = JobDescription;
        this.Followers = Followers;		 				
        this.Following = Following;
        this.UserRecipies = UserRecipies;
        this.ISPrivate = ISPrivate;
        this.Language = Language;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.LikedRecipies = LikedRecipies;	
    }
}

export class GroupDetails {
    Id: string;
    Name: string; 
    Job: string; 
    ImageUrl:string
}

export class FollowUserInfo {
  UserId: string;
  UserName: String;
  JobDescription: String;
  constructor(UserId: string, UserName: String, JobDescription: String) {
    this.UserId = UserId;
    this.UserName = UserName;
    this.JobDescription = JobDescription;
  }
}