import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../../services/validate.service';
import { UserService} from '../../../services/rest-api/user.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {QRCodeComponent} from 'angular2-qrcode';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
  
})
export class QrcodeComponent implements OnInit {
	  name: String;
    email: String;
    content: String;
    pre_image: String;
    image_base64:String;
    
 	constructor(
				private validateService: ValidateService,
                private flashMessage: FlashMessagesService,
                private authService: UserService,
                private router: Router,
                private toastrService: ToastrService
 		) { }

  ngOnInit() {
    
  }
	onQRcodeSubmit(){
    	const user = {
       	name: this.name,
        email: this.email,
        content: this.content,
        image: this.pre_image
      }

	// Required Fields
    if(!this.validateService.validateQRcode(user)) {
      this.flashMessage.show('Please fill all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    // Required Email
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Invalid Email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    // receive image
    let canvase = document.getElementById('base64');
    this.pre_image = canvase.innerHTML;
    let end = this.pre_image.lastIndexOf("width") - 1;
    this.image_base64 = this.pre_image.slice(9, end);
    console.log(this.pre_image);
    //}
    // Register QRcode
    this.authService.registerQRcode(user).subscribe(data => {
      if(data.success){
        this.toastrService.success('Created!', 'Success');
         } else {
          this.toastrService.error('Oops! please try later', 'Error');
        
      }
  })
}
}