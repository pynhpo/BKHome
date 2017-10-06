import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidateService} from '../../../../../services/validate.service';
import { UserService} from '../../../../../services/rest-api/user.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {QRCodeComponent} from 'angular2-qrcode';

@Component({
  selector: 'app-qrcode-access',
  templateUrl: './qrcode-access.component.html',
  styleUrls: ['./qrcode-access.component.css']
})
export class QrcodeAccessComponent implements OnInit {
  @Output() backEvent = new EventEmitter();
  @Output() isFingerprintAvailable = new EventEmitter<Boolean>();
  @Input() user;

  name: String;
  email: String;
  content: String;
  pre_image: String;
  image_base64:String;
  users: Object;
  userSelectedId: String;
  userDeletedName: String;
  deleteUsers = [];
  success: boolean;
  test: boolean;
  
  constructor(
    private validateService: ValidateService,
            private flashMessage: FlashMessagesService,
            private authService: UserService,
            private router: Router,
            private toastrService: ToastrService
 ) { }

ngOnInit() {
this.getListOfusers();
}


onQRcodeSubmit(){
  // receive image
let canvase = document.getElementById('base64');
this.pre_image = canvase.innerHTML;
let end = this.pre_image.lastIndexOf("width") - 2;
this.image_base64 = this.pre_image.slice(32, end);

const QRuser = {
  name: this.name,
  email: this.email,
  content: this.content,
  image: this.image_base64,
  _userId: this.user
}

// Required Fields
if(!this.validateService.validateQRcode(QRuser)) {
this.toastrService.error('Oops! please fill all fields', 'Error');
return false;
}
// Required Email
//if(!this.validateService.validateEmail(user.email)) {
//  this.flashMessage.show('Invalid Email', {cssClass: 'alert-danger', timeout: 3000});
//  return false;
//}
// Register QRcode
this.authService.registerQRcode(QRuser).subscribe(data => {
  if(data.success){
    this.toastrService.success('Created!', 'Success');
    } else {
    this.toastrService.error('Oops! please try later', 'Error');
    
  }
})

this.getListOfusers();
}

getuser(name,userId){
this.userSelectedId = userId;
this.test = (document.getElementById(userId) as HTMLInputElement).checked

if (this.test){
this.deleteUsers.push(this.userSelectedId);

}
else{
  for(let i=0; i<this.deleteUsers.length; i++){
  if (this.userSelectedId == this.deleteUsers[i] ){
    this.deleteUsers.splice(i,1);
     }
  
}

}
}

getListOfusers(){
this.authService.getListOfQRcodes().subscribe(res => {
if(!res.success){
console.log(res.msg)
} else{
this.users = res.users;
}
},
err => {
console.log(err);
return false;
});
}

deleteUser(){
for(let i=0; i<this.deleteUsers.length; i++){
this.authService.deleteUser(this.deleteUsers[i]).subscribe(res => {
if(res.success){
  this.deleteUsers = [];
  this.success = true;
}     
})
}
if (this.success){
this.toastrService.success('deleted!', 'Success');
} else {
this.toastrService.error('Oops! please try later', 'Error');
}
this.getListOfusers()
}
}
