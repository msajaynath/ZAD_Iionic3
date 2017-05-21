import { Component ,ViewChild} from '@angular/core';
import { IonicPage,Slides, NavController,LoadingController,ToastController, ActionSheetController,NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { VideoEditor } from '@ionic-native/video-editor';
import { Storage } from '@ionic/storage';
import { CommonServices } from '../service/generalservices';
import { RecipieService } from '../service/RecipieServices';
import { CreateRecipieModel } from '../Models/createrecipiemodel'
import {TranslateService} from '@ngx-translate/core';
declare var window: any;

declare var require: any
require('aws-sdk/dist/aws-sdk');
declare var cordova: any;
declare const Buffer
@IonicPage({name:'CreateRecipie'})
@Component({
  selector: 'page-create-recipie',
  templateUrl: 'create-recipie.html',
  providers:[RecipieService,CommonServices]
})
export class CreateRecipiePage {
  noOfIngredents: number;
  resultCreatedText: any;
  resultText: String;
  awsSecret: String;
  awsKey: String;
  Ingredents: Array<{ ingredent: string }>;
  Directions: Array<{ direction: string }>;
  LookUp: Array<{
    CategoryTag: Array<{ Id: string, CategoryNameEn: string, CategoryNameAr: string }>,
    CookingTypeTag: Array<{ Id: string, CookingTypeNameEn: string, CookingTypeNameAr: string }>,
    CusineTag: Array<{ Id: string, CusineNameEn: string, CusineNameAr: string }>,
    Time: Array<{ Id: string, TimeEn: string, TimeAr: string }>,
    Calories: Array<{ Id: string, CaloriesNameEn: string, CaloriesNameAr: string }>
  }>;
  createRecipie;
  currentLanguage: string;
  options: any;
  imageProgress: Boolean;
  videoProgress: Boolean;
  confirmExit: Boolean;

  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;

  constructor(private videoEditor: VideoEditor,public Camera:Camera,public ImagePicker:ImagePicker, public navCtrl: NavController, public translate: TranslateService, public storage: Storage, public recipieService: RecipieService, public commonServices: CommonServices, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.imageProgress = false;
    this.videoProgress = false;
    this.confirmExit = false;
    this.awsKey = "";
    this.awsSecret = "";
    this.currentLanguage = this.translate.currentLang;
    this.createRecipie = new CreateRecipieModel('', '', '', '', '', [], [], 0, '', [], [], '', '', '');
    this.resultText = '';
    this.Ingredents = [];
    this.Directions = [];
    this.options = {};
    this.commonServices.GetKey().then((keyData: any) => {
    this.awsKey=keyData.key;
    this.awsSecret=keyData.secret;
    });

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
    this.AddIngredents()
    this.AddIngredents()
    this.AddIngredents()
    this.AddMoreSteps()
    this.AddMoreSteps()

    this.storage.ready().then(() => {
      this.storage.get('LoggedInUserId').then((val) => {

        if (val == null) {
          this.options.PageName = 'CreateRecipie';
          this.options.UserId = val;
          this.navCtrl.setPages([
            { page: 'Login', params: { 'params': this.options } }
          ])
        }
        else if (val.length > 0) {
          this.noOfIngredents = 0;
          this.storage.get('FullLookUp').then((val) => {
            this.LookUp = val;
            this.resultText = this.LookUp[0].CategoryTag[0].CategoryNameEn;
          });
          this.storage.get('LoggedInUserDetails').then((info) => {
            this.createRecipie.MakerId = info.id;
            this.createRecipie.MakerName = info.Name;
          });
        }
      });
    });
          if (window.cordova && window.cordova.plugins.Keyboard) {
        // This requires installation of https://github.com/driftyco/ionic-plugin-keyboard
        // and can only affect native compiled Ionic2 apps (not webserved).
        cordova.plugins.Keyboard.disableScroll(true);
      }
  }

  AddMore(currentindex, tab) {
    if (tab == 'ingredent') {
      if (currentindex == this.Ingredents.length - 1)
        this.AddIngredents()
    }
    if (tab == 'direction') {
      if (currentindex == this.Directions.length - 1)
        this.AddMoreSteps()
    }
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
  }

  AddIngredents() {
    this.Ingredents.push({ ingredent: '' })
  }
  AddPhotos() {
    this.createRecipie.PhotosList.push({ s3Url: "assets/Images/BeefRoast.jpg", isPrimary: true });
  }
  SaveRecipieDetails() {
    let isValid = true;
    if (this.createRecipie.RecipeName.length < 3) {
      this.presentToast("Please add Recipie Name");
      isValid = false; return;
    }
    else if (this.createRecipie.RecipeDescription.length < 5) {
      this.presentToast("Please add Recipe Description");
      isValid = false; return;
    }

    if (this.Ingredents.length > 0) {
      this.createRecipie.Ingredents = [];
      let OneIngredentAdded = false;
      for (let i = 0; i < this.Ingredents.length; i++) {
        if (this.Ingredents[i].ingredent.length > 5 && this.Ingredents[i].ingredent.trim() != '') {
          OneIngredentAdded = true;
          this.createRecipie.Ingredents.push({ Name: this.Ingredents[i].ingredent });
        }
      }
      if (!OneIngredentAdded) {
        this.presentToast("Please add correct Ingredent");
        isValid = false
        this.createRecipie.Ingredents = [];
        this.slider.slideTo(0);
        return;
      }
    }

    if (isValid) {
      this.createRecipie.Directions = [];
      let OneDirectionAdded = false;
      for (let i = 0; i < this.Directions.length; i++) {
        if (this.Directions[i].direction.length > 5 && this.Directions[i].direction.trim() != '') {
          OneDirectionAdded = true;
          this.createRecipie.Directions.push(this.Directions[i].direction);
        }
      }
      if (!OneDirectionAdded) {
        this.presentToast("Please add correct Directions");
        isValid = false;
        this.createRecipie.Ingredents = [];
        this.slider.slideTo(1);
        return;
      }
    }

    if (this.createRecipie.Category.length == 0) {
      this.presentToast("Please add a Category");
      isValid = false; this.slider.slideTo(2);
      return;

    }
    else if (this.createRecipie.CookingType.length == 0) {
      this.presentToast("Please add Cooking Type"); this.slider.slideTo(2);
      isValid = false;
      return;
    }
    else if (this.createRecipie.Cusine.length == 0) {
      this.presentToast("Please add Cusine"); this.slider.slideTo(2);
      isValid = false; return;
    }

    else if (this.createRecipie.Time.length == 0) {
      this.presentToast("Please add Time to cook"); this.slider.slideTo(2);
      isValid = false; return;
    }
    else if (this.createRecipie.Calories.length == 0) {
      this.presentToast("Please add approxmiate calorie value"); this.slider.slideTo(2);
      isValid = false; return;
    }

    if (this.createRecipie.Images.length == 0) {
      this.presentToast("Please add atleast one image");
      isValid = false;
      this.slider.slideTo(3);
      return;
    }

    if (isValid) {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src='assets/loading/loading.gif'>`
      });
      loading.present();
      this.recipieService.SaveRecipie(this.createRecipie).then((resultCreatedText: any) => {
        this.resultCreatedText = resultCreatedText;

        if (this.resultCreatedText.status == true) {
          this.presentToast(this.resultCreatedText.message);
          this.Ingredents = [];
          this.Directions = [];
          this.AddIngredents()
          this.AddIngredents()
          this.AddMoreSteps()
          this.AddMoreSteps()
          this.createRecipie = new CreateRecipieModel('', '', '', '', '', [], [], 0, '', [], [], '', '', '');
          loading.dismiss();
        }
        else {
          this.presentToast(this.resultCreatedText.message)
          loading.dismiss();
        }
      });
    }
  }

  closeIngredent(item) {
    this.Ingredents.splice(item, 1);
  }

  AddMoreSteps() {
    this.Directions.push({ direction: '' });
  }

  closeSteps(i) {
    this.Directions.splice(i, 1);
  }


  public presentVideoActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Video Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takeVideo(this.Camera.PictureSourceType.PHOTOLIBRARY);
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

  public presentActionSheet() {
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
  public openGallery (): void {
  let optionss = {
    maximumImagesCount: 5,
    width: 640,
    height: 480,
    quality: 100,
    outputType:0
  }

 this.ImagePicker.getPictures(optionss).then((results) => {
  for (var i = 0; i < results.length; i++) {
          this.uploadImage(results[i]);
          alert(results[i]);

  }
}, (err) => { this.presentToast('Error while selecting image.'); });
}

  private takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.Camera.DestinationType.DATA_URL,
      targetWidth: 640,
      targetHeight: 480
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      this.uploadImage(imagePath);

    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }



  public videoOptions: any = {
    sourceType: this.Camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: this.Camera.MediaType.ALLMEDIA,
    destinationType: this.Camera.DestinationType.FILE_URI
  }

  private takeVideo(sourceType) {
    this.Camera.getPicture(this.videoOptions).then((fileUri: any) => {
      this.videoProgress = true;

      this.videoEditor.transcodeVideo({
        fileUri: 'file://' + fileUri,
        width: 680,
        videoBitrate: 500000,
        height: 480,
        outputFileName: 'zad'
      })
        .then((fileUri: string) => {//alert('video transcode success'+fileUri);

          window.resolveLocalFileSystemURL('file://' + fileUri, (fileEntry) => {
            fileEntry.file((file) => {
              const fileReader = new FileReader();
              fileReader.onloadend = (result: any) => {
                let arrayBuffer = result.target.result;
                this.uploadVideo(arrayBuffer);
              };
              fileReader.onerror = (error: any) => {
              };
              fileReader.readAsArrayBuffer(file);

            });
          });

        })
        .catch((error: any) => {
          alert('video transcode error' + error);
          this.videoProgress = false;

        });

    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  uploadImage(images) {
    this.imageProgress = true;

    var AWSService = (<any>window).AWS;
    var buf = new Buffer(images.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    AWSService.config.accessKeyId = this.awsKey;
    AWSService.config.secretAccessKey = this.awsSecret;
    AWSService.config.signatureVersion = 'v4';
    var bucket = new AWSService.S3({ params: { Bucket: 'zadapp' } });
    var timestamp = new Date().getUTCMilliseconds();
    var params = {
      Key: "recipiesImages/zad_" + timestamp + ".jpeg", Body: buf, ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    bucket.upload(params, (err, data) => {
      this.imageProgress = false;
      if (err)
        this.presentToast("Error occured while uploading");
      else {
        this.presentToast("Upload successfull.");
        let imageLength = this.createRecipie.Images.length;
        this.createRecipie.Images.push({ URL: data.Location, Order: imageLength, Type: "jpeg" });

      }
    });
  }



  uploadVideo(videoBuffer) {
    this.videoProgress = true;

    var AWSService = (<any>window).AWS;
    AWSService.config.accessKeyId = this.awsKey;

    AWSService.config.secretAccessKey = this.awsSecret;
    AWSService.config.signatureVersion = 'v4';
    var bucket = new AWSService.S3({ params: { Bucket: 'zadapp' } });
    var timestamp = new Date().getUTCMilliseconds();

    var params = {
      Key: "recipieVideos/zad_" + timestamp + ".mp4", Body: videoBuffer,
      ContentType: 'video/mp4'
    };

    bucket.upload(params, (err, data) => {
      this.videoProgress = false;
      if (err)
        this.presentToast("Error occured while uploading");
      else {
        this.presentToast("Upload successfull.");
        let videoLength = this.createRecipie.Videos.length;
        this.createRecipie.Videos.push({ URL: data.Location, Order: videoLength, Type: "video/mp4" });
      }
    });
  }

  deleteImage(index) {
    this.imageProgress = true;

    var AWSService = (<any>window).AWS;
    AWSService.config.accessKeyId = this.awsKey;
    AWSService.config.secretAccessKey = this.awsSecret;
    AWSService.config.signatureVersion = 'v4';
    var bucket = new AWSService.S3({ params: { Bucket: 'zadapp' } });
    var params = {
      Bucket: 'zadapp', Key: index.URL.replace("https://zadapp.s3.amazonaws.com/", "")
    };

    bucket.deleteObject(params, (err, data) => {

      this.imageProgress = false;

      if (err)
        this.presentToast("Error occured while deleting");
      else {
        this.presentToast("Delete successfull.");
        let tempArray = [];
        let counterVar = 0;
        for (let counter = 0; counter < this.createRecipie.Images.length; counter++) {
          if (counter == index.Order) continue; ///deleted.
          tempArray.push({ URL: this.createRecipie.Images[counter].URL, Order: counterVar++, Type: "jpeg" });

        }
        this.createRecipie.Images = tempArray;

      }
    });
  }

  deleteVideo(index) {
    this.videoProgress = true;
    var AWSService = (<any>window).AWS;
    AWSService.config.accessKeyId = this.awsKey;
    AWSService.config.secretAccessKey = this.awsSecret;
    AWSService.config.signatureVersion = 'v4';
    var bucket = new AWSService.S3({ params: { Bucket: 'zadapp' } });
    var params = {
      Bucket: 'zadapp', Key: index.URL.replace("https://zadapp.s3.amazonaws.com/", "")
    };

    bucket.deleteObject(params, (err, data) => {
      this.videoProgress = false;
      if (err)
        this.presentToast("Error occured while deleting");
      else {
        this.presentToast("Delete successfull.");
        let tempArray = [];
        let counterVar = 0;
        for (let counter = 0; counter < this.createRecipie.Videos.length; counter++) {
          if (counter == index.Order) continue; ///deleted.
          tempArray.push({ URL: this.createRecipie.Videos[counter].URL, Order: counterVar++, Type: "video/mp4" });
        }
        this.createRecipie.Videos = tempArray;
      }
    });
  }
  changePrimary(index) {
    if (index.Order == 0) {
      return;
    }

    else////reorder array
    {
      let tempArray = [];
      tempArray.push({ URL: index.URL, Order: 0, Type: "jpeg" });
      let counterVar = 1;
      for (let counter = 0; counter < this.createRecipie.Images.length; counter++) {
        if (counter == index.Order) continue; ///already pushed.
        tempArray.push({ URL: this.createRecipie.Images[counter].URL, Order: counterVar++, Type: "jpeg" });

      }
      this.createRecipie.Images = tempArray;
    }
  }

}
