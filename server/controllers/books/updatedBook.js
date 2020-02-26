const Books = require('../../models/books.model');

const updatedBook = (req, res) => {
  const bookId = req.params.bookId;

  // console.log('updatedBook route');
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

  Books.findByIdAndUpdate(
    {
      _id: bookId
    },
    {
      $set: {
        ...req.body
      }
    },
    {
      new: true
    }
  )
    .then(result => {
      // console.log('result', result);
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = updatedBook;
