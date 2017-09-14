import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../../services/validate.service';
import { UserService} from '../../../services/rest-api/user.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
	  name: String;
  	email: String;
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
       	email: this.email
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