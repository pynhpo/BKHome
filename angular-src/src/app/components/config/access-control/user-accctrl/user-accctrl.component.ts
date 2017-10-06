import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { AccessControlService } from '../../../../services/rest-api/access-control.service';
import { MessageEventService } from '../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-user-accctrl',
  templateUrl: './user-accctrl.component.html',
  styleUrls: ['./user-accctrl.component.css']
})
export class UserAccctrlComponent implements OnInit, OnChanges {
  @Input() user;
  @Output() deleteUserEvent = new EventEmitter();

  constructor(
    public accessControlService: AccessControlService,
    public messageEvent: MessageEventService
  ) { }

  main_row_hidden = false;
  fingerprint_hidden = true;
  face_hidden = true;
  qr_hiden = true;
  grayFilter = {filter: 'grayscale(100%)', color: 'gray'};
  isQRCODEAvailable = false;
  isFingerprintAvailable = false;
  avatar: String;

  ngOnInit() {
    if(!this.user.imgPath){
      this.user.imgPath = "./assets/images/avatars/NoAvatar.jpg";
    }
    this.isFingerprintAvailable = !!this.user.fingerprintId.length;
    this.avatar = this.user.imgPath;
  }

  ngOnChanges(){
    console.log("changed")
  }

  addImgSubmit(imgPath){
    this.user.imgPath = imgPath;
    let body = {
      imgPath: imgPath
    }
    this.accessControlService.updateImgPath(this.user._id, body).subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      }
    })
  }

  deleteUser(){
    this.accessControlService.deleteUser(this.user._id).subscribe(res=>{
      console.log(res);
      this.deleteUserEvent.emit();
    })
  }

  show_main_row(){
    this.main_row_hidden = false;
    this.fingerprint_hidden = true;
    this.face_hidden = true;
    this.qr_hiden = true;
  }

  show_fingerprint_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = false;
    this.face_hidden = true;
    this.qr_hiden = true;
  }

  show_face_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = true;
    this.face_hidden = false;
    this.qr_hiden = true;
  }

  show_qrcode_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = true;
    this.face_hidden = true;
    this.qr_hiden = false;

  }

}
