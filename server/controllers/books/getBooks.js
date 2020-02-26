const Books = require('../../models/books.model');

const getBooks = (req, res) => {
  const userId = req.user.id;
  // console.log('getBooks route');
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

  Books.find({
    userId
  })
    .then(result => {
      // console.log('result', result);
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = getBooks;
