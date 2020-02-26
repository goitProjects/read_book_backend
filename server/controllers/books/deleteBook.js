const Books = require('../../models/books.model');

const deleteBook = (req, res) => {
  console.log('deleteBook route');
  const bookId = req.params.bookId;
  console.log('bookId', bookId);
  const sendResponse = books => {
    res.status(200);
    res.json({
      status: 'success',
      books
    });
  };

  const sendError = error => {
    const errMessage = error.message || 'must handle this error on login';
    res.status(400).json({
      status: 'error',
      message: errMessage,
      error: error
    });
  };

  Books.findByIdAndDelete(bookId)
    .then(result => {
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = deleteBook;
