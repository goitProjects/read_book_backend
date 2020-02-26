const router = require('express').Router();
const passport = require('passport');

const {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  restorePassword
} = require('../controllers/user');

const passportCheck = passport.authenticate('jwt', {
  session: false
});

router
  .get('/users', getUsers)
  .get('/me', passportCheck, getUser)
  .delete('/', passportCheck, deleteUser)
  .patch('/', passportCheck, updateUser)
  .post('/restore', restorePassword);

module.exports = router;
