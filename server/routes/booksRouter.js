const router = require('express').Router();
const passport = require('passport');

const passportCheck = passport.authenticate('jwt', {
  session: false
});

const {
  addBook,
  getBooks,
  getBook,
  updatedBook,
  deleteBook
} = require('../controllers/books');

router
  .get('/', passportCheck, getBooks)
  .post('/create', passportCheck, addBook)
  .get('/:bookId', passportCheck, getBook)
  .patch('/:bookId', passportCheck, updatedBook)
  .delete('/:bookId', passportCheck, deleteBook);

module.exports = router;
