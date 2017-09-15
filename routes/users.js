const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../mongodb/user-model/user');
const QR = require('../mongodb/user-model/qrcode');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

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
router.post('/qrcode', (req, res, next) => {
  let newUser = new QR({
    name: req.body.name,
    email: req.body.email,
    content: req.body.content,
    image: req.body.image
    });

  QR.addQRcode(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to create QRcode'});
    } else {
      res.json({success: true, msg:'QRcode created'});
    }
    });

  var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: 'smarthomebk13@gmail.com', // Your email id
        pass: 'smarthomebk1395' // Your password
    }
  })
  let imagecode = newUser.image;
  var mailOptions = {
    from: 'smarthomebk13@gmail.com',
    to: newUser.email,
    subject: 'Your QRcode to open the door',
    template: 'mail',
    text: 'dayne -_-',
    html: '<b>' + imagecode + '</b>'
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
