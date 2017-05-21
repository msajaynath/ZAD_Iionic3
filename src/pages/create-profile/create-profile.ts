import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ActionSheetController, ToastController, LoadingController} from 'ionic-angular';
import { CreateUserModel } from '../Models/createusermodel';
import { UserService } from '../service/UserServices';
import { ProfileDetails } from '../Models/ProfileDetails'
import { Storage } from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import { LanguageService } from '../service/language';
import { Camera } from '@ionic-native/camera';
import { CommonServices } from '../service/generalservices';

declare const Buffer

/**
 * Generated class for the CreateProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name:'CreateProfile'})
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
  providers:[UserService,CommonServices]
})
export class CreateProfilePage {
  UserInfo: ProfileDetails;
  PageTitle: any;
  Languages: Array<{ LanguageId: string, LanguageName: string }>;
  createProfile;
  isEditing: boolean;
  resultText: any;
  s3BaseURL: String;
  awsSecret: String;
  awsKey: String;
  islanguageSet: boolean;
  createConfirm :string;
  isEmailAlreadyRegistered: boolean
  constructor(public loadingCtrl: LoadingController,public commonServices:CommonServices, public Camera:Camera,public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public storage: Storage, public translate: TranslateService, public language: LanguageService, public toastCtrl: ToastController, public userService: UserService, public navParams: NavParams) {
    this.isEmailAlreadyRegistered = false;
    this.createConfirm ='';
    this.islanguageSet  = true;
    this.s3BaseURL = commonServices.profileUrl;
    //this.awsKey = "";
   // this.awsSecret = "";
    this.awsKey="";
    this.awsSecret="";
    this.UserInfo = navParams.get('UserInfo');
    this.PageTitle = navParams.get('pageName');
    this.isEditing = false;    
    this.Languages = [];
    this.Languages.push({ LanguageId: 'ar', LanguageName: 'Arabic' });
    this.Languages.push({ LanguageId: 'en', LanguageName: 'English' });
this.commonServices.GetKey().then((keyData: any) => {
    this.awsKey=keyData.key;
    this.awsSecret=keyData.secret;
    });

    if (this.PageTitle == 'EditProfile') {
      this.createProfile = new CreateUserModel('', '', '', this.UserInfo.Name, this.UserInfo.JobDescription, this.UserInfo.ISPrivate,
      this.UserInfo.Language, this.UserInfo.Email, this.UserInfo.PhoneNumber);
      this.isEditing = true;
      this.createConfirm = 'abcd';
    }
    else
    {      
      this.storage.ready().then(() => {
        this.storage.get('language').then((lang) => {
          if(lang != null){
            this.islanguageSet = true;
            this.createProfile = new CreateUserModel('', '', '', '', '', false, lang, '', '');
            this.createConfirm = 'abcd';
          }
          else{
            this.islanguageSet = false;
            this.createProfile = new CreateUserModel('', '', '', '', '', false, '', '', '');
            this.createConfirm = 'abcd';
          }
        })
      })
    }
  }

  CheckEmailUnique(email){
    this.userService.checkuser(email).then((resultText: any) => {
      if(resultText.status == false){
        this.presentToast(resultText.message);
        this.isEmailAlreadyRegistered = true;
      }
    })
  }

  SaveProfile() {
    if(!this.isEmailAlreadyRegistered){
      let isValid = true;
      if (this.createProfile.Name.length == 0) {
        this.presentToast("Please add your name");
        isValid = false
      }
      else if (this.createProfile.JobDescription.length == 0) {
        this.presentToast("Please add your Job Description");
        isValid = false
      }
      else if (this.createProfile.Email.length == 0) {
          this.presentToast("Please add Email");
          isValid = false;
      }
      else if (!this.validateEmail(this.createProfile.Email)) {
        this.presentToast("Please add correct Email");
        isValid = false
      }
      else if (this.createProfile.PhoneNumber.length > 0) {
        if (!this.mobileValidation()) {
          this.presentToast("Please add correct Phone number");
          isValid = false
        }
      }
      // else if (!this.mobileValidation()) {
      //   this.presentToast("Please add correct Phone number");
      //   isValid = false
      // }
      else if (this.createProfile.Password.length == 0 && !this.isEditing) {
        this.presentToast("Please add your Password");
        isValid = false
      }
      else if (this.createProfile.ConfirmPassword.length == 0 && !this.isEditing) {
        this.presentToast("Please enter ConfirmPassword");
        isValid = false
      }
      else if (!this.PasswordMatching() && !this.isEditing) {
        this.presentToast("Password doesnot match");
        isValid = false
      }
      else if (this.createProfile.Language.length == 0) {
        this.presentToast("Please enter Language preference");
        isValid = false
      }
      if (isValid) {
        if (this.PageTitle == 'EditProfile') {
          this.storage.ready().then(() => {
            this.storage.get('LoggedInUserId').then((userid) => {
              this.createProfile.Id = userid;
              this.userService.SaveUser(this.createProfile, 'edit').then((resultText: any) => {
                this.resultText = resultText;
                if (this.resultText.status == true) {
                  this.storage.set('FavList', resultText.CookBookUserList);
                  this.storage.set('LoggedInUserId', resultText.LoggedInUserDetails.id);
                  this.storage.set('LoggedInUserDetails', resultText.LoggedInUserDetails);
                  this.translate.use(resultText.LoggedInUserDetails.Language);
                  this.language.setValue(resultText.LoggedInUserDetails.Language)
                  this.navCtrl.setPages([
                    { page: 'Home' }
                  ])
                }
                else
                  alert(this.resultText.message)
              });
            });
          });
        }
        else {
          this.userService.SaveUser(this.createProfile, 'signup').then((resultText: any) => {
            this.resultText = resultText;
            if (this.resultText.status == true) {
              this.storage.set('FavList', resultText.CookBookUserList);
              this.storage.set('LoggedInUserId', resultText.LoggedInUserDetails.id);
              this.storage.set('LoggedInUserDetails', resultText.LoggedInUserDetails);
              this.translate.use(resultText.LoggedInUserDetails.Language);
              this.language.setValue(resultText.LoggedInUserDetails.Language);            
              this.navCtrl.setPages([
                { page: 'Home' }
              ])
            }
            else
              alert(this.resultText.message)
          });
        }
      }
    }
    else
      this.presentToast("Email Already Registered");
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  PasswordMatching() {
    if (this.createProfile.Password == this.createProfile.ConfirmPassword)
      return true;
    else
      return false;
  }

  mobileValidation() {
    return /^\d{10}$/.test(this.createProfile.PhoneNumber)
  }
  ChangeImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.Camera.PictureSourceType.CAMERA);
          }
        },

        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  private takePicture(sourceType) {
    var options = {
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.Camera.DestinationType.DATA_URL,
      targetWidth: 150,
      targetHeight: 150,
      allowEdit:true
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      this.uploadImage(imagePath);

    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  uploadImage(images) {
    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();

    var AWSService = (<any>window).AWS;
    
    var buf = new Buffer(images.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    AWSService.config.accessKeyId = this.awsKey;

    AWSService.config.secretAccessKey = this.awsSecret;
    AWSService.config.signatureVersion = 'v4';
    var bucket = new AWSService.S3({ params: { Bucket: 'zadapp' } });

    var params = {
      Key: "ProfileImages/" + this.UserInfo.id + ".jpeg", Body: buf, ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    bucket.upload(params, (err, data) => {
      loading.dismiss();
      if (err)
        this.presentToast("Error occured while uploading");
      else {
        this.presentToast("Upload successfull.");
      }
    });
  }

}
