var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//===========================
// User schema
//===========================
var userSchema = new Schema({
  facebook: {
      id         : String,
      token      : String,
      name       : String,
      email      : String,
      photo      : String
  },
  rdio: {
      id         : String,
      token      : String,
      name       : String,
      email      : String,
      photo      : String
  },
  updated_at: {type: Date}
});

module.exports = mongoose.model('User', userSchema);
