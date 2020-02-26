const Books = require('../../models/books.model');

const getBook = (req, res) => {
  console.log('getBook route');

  const bookId = req.params.bookId;

  const sendResponse = book => {
    res.status(200);
    res.json({
      status: 'success',
      book
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

  Books.findById(bookId)
    .then(result => {
      // console.log('result', result);
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = getBook;
