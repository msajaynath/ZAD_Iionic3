export class CreateUserModel {	
  Password								: String;
	ConfirmPassword					: String;
  Name			              : String;
  JobDescription     			: String;;
  ISPrivate      					: Boolean;  
  Language      					: String;    
  Email    								: String;
  PhoneNumber     				: String;
  Id	        : String;
	constructor(Id:String,Password: String, ConfirmPassword: String, Name : String, JobDescription : String, 
              ISPrivate : Boolean,Language 	: String,  Email : String,  PhoneNumber: String) {
		this.Password = Password;
		this.Id = Id;
		this.ConfirmPassword = ConfirmPassword;
		this.Name = Name;						
		this.JobDescription = JobDescription;
		this.ISPrivate = ISPrivate;
		this.Language = Language;
		this.Email = Email;
		this.PhoneNumber = PhoneNumber;
	}
}


