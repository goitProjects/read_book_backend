const User = require('../../models/user.model');
const login = require('./login');
const Joi = require('joi');
const { ValidationError } = require('../../core/error');

// Register New User and Check this email have in DB
const userSignup = (req, res) => {
  const schema = Joi.object()
    .keys({
      email: Joi.string()
        .regex(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
        .required(),
      password: Joi.string()
        .min(6)
        .max(16)
        .required(),
      // name: Joi.string()
      //   .min(6)
      //   .max(16)
      name: Joi.object().keys({
        firstName: Joi.string()
          .min(3)
          .max(16),
        lastName: Joi.string()
          .min(3)
          .max(16),
        fullName: Joi.string()
          .min(3)
          .max(33)
      })
    })
    .options({
      stripUnknown: true,
      abortEarly: false
    });

  const result = schema.validate(req.body);
  console.log('result', result);

  if (result.error)
    throw new ValidationError({ message: result.error.message, status: 400 });

  const sendError = error => {
    const errMessage =
      error.message || 'must handle this error on registration';
    res.json({
      status: 'error',
      error: errMessage
    });
  };

  const newUser = new User(result.value);

  newUser
    .save()
    .then(() => {
      login(req, res);
    })
    .catch(sendError);
};

module.exports = userSignup;

/*
{
"email":"testuser2@testuser.com",
"name": {
    "firstName": "test2",
    "lastName": "user2",
    "fullName": "test2 user2"
  },
"password":"password"
}
*/
