import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { AppSettings } from './generalservices';

@Injectable()

export class UserService {

	constructor(private http: Http) {	}
	SaveUser(UserInfo, type) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + type, UserInfo)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	FollowUser(userId, name, followUserInfo) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'FollowUser', { userId: userId, name: name, followUserInfo: followUserInfo })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	LoginValidation(UserId, Password) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'login', { UserName: UserId, Password: Password })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}
	
	checkuser(UserName){
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'checkuser', { UserName: UserName })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetUserProfile(ProfileId, UserId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.UserServiceUrl + 'GetUserProfileDetails?ProfileId=' + ProfileId +'&UserId=' + UserId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetNotifications(userId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.UserServiceUrl + 'GetNotifications?userId=' + userId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

ArchiveNotifications(id) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'ArchiveNotifications', { id: id })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	ChangeLanguage(UserId, Language) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'changeLanguage', { UserId: UserId, Language: Language })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	AssignPrivate(UserId, IsPrivate) {
		return new Promise(resolve => {
			this.http.post(AppSettings.UserServiceUrl + 'private', { UserId: UserId, PrivateFlag: IsPrivate })
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetFollowersList(userId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.UserServiceUrl + 'GetFollowersList?userId=' + userId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}

	GetFollowingList(userId) {
		return new Promise(resolve => {
			this.http.get(AppSettings.UserServiceUrl + 'GetFollowingList?userId=' + userId)
				.subscribe(data => {
					resolve(data.json());
				}, error => {
					console.log("Oooops!");
				});
		});
	}
}