const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../mongodb/user-model/user');
const QR = require('../mongodb/user-model/qrcode');
const nodemailer = require('nodemailer');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// QRcode
router.get('/qrcode', (req, res, next) => {
  QR.getListOfQRcodes()
  .then(users=>{
    res.json({success: true, users: users});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//Delete qrcode
router.delete('/qrcode/:id', (req, res, next) => {
  userId = req.params.id;
  QR.deleteUser(userId)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});
 

router.post('/qrcode', (req, res, next) => {
  let newUser = new QR({
    name: req.body.name,
    email: req.body.email,
    content: req.body.content,
    userId: req.body._userId
    });


QR.addQRcode(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to create QRcode'});
    } else {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
    });
    
var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'smarthomebk13@gmail.com', // Your email id
        pass: 'smarthomebk1395' // Your password
    }
  })
  
  
console.log(req.body.image);
var mailOptions = {
    from: 'smarthomebk13@gmail.com',
    to: req.body.email,
    subject: 'Your QRcode to open the door',
    text: 'Touch the picture to zoom out',
    attachments: [
      {   // encoded string as an attachment
        filename: 'image.png',
        content: req.body.image,
        encoding: 'base64'
    }
  ]
  }

transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log('Error');
    } else {
        console.log('Email Sent');
    }
})

});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('getUserById', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
