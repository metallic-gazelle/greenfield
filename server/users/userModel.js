var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');
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

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
