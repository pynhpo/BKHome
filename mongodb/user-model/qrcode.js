const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const Schema = mongoose.Schema;

// QR Schema
const QRSchema = new Schema({
    name: String,
    email: {type: String, required: true},
    content: String,
    image: String   
  });

  const QR = module.exports = mongoose.model('QR', QRSchema);

  module.exports.addQRcode = function(newUser, callback){
       newUser.save(callback);
      };