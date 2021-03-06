const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../config/config');

const UserSchema = new mongoose.Schema(
  {
    name: {
      firstName: String,
      lastName: String,
      fullName: String
    },
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
      type: String
    },
    photo: String,
    token: {
      type: String
    },
    googleId: {
      type: String,
      index: true
    },
    haveTraining: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.getPublicFields = function () {
  const returnObject = {
    userData: {
      name: this.name,
      email: this.email,
      photo: this.photo,
      haveTraining: this.haveTraining
    },
    token: this.token
  };
  return returnObject;
};

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) {
  const user = this;

  if (
    // eslint-disable-next-line no-extra-parens
    (user.password && this.isModified('password')) ||
    // eslint-disable-next-line no-extra-parens
    (user.password && this.isNew)
  )
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  else return next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  // If change password
  // hello callback hell
  if (update.$set && update.$set.password)
    bcrypt
      .hash(update.$set.password, 10)
      .then(hashedPassword => {
        update.$set.password = hashedPassword;
        next();
      })
      .catch(err => next(err));
  else next();
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) return cb(err);

    return cb(null, isMatch);
  });
};

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSalt(10), null);
};

UserSchema.methods.validatePassword = function (password) {
  const compare = bcrypt.compareSync(password, this.password);
  return compare;
};

UserSchema.methods.getJWT = function () {
  const preToken = jwt.sign(
    {
      id: this._id
    },
    config.secretJwtKey
  );

  const token = preToken;

  this.token = token;
  this.save();
  return token;
};

// Export the model
module.exports = mongoose.model('Users', UserSchema);
