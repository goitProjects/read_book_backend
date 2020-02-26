const Training = require('../../models/training.model');

const updateTraining = (req, res) => {
  const trainingId = req.params.trainingId;
  const userId = req.user.id;
  const addNewCounts = req.body;
  // console.log('updatedBook route');
  const sendResponse = newTime => {
    res.status(200);
    res.json({
      status: 'success',
      pagesReadResult: newTime
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

  Training.findOneAndUpdate(
    {
      _id: trainingId,
      userId
    },
    {
      $push: {
        pagesReadResult: addNewCounts
      }
    },
    {
      new: true
    }
  )
    .populate('books.book', { title: 1, author: 1, year: 1, pagesCount: 1 })
    .then(result => {
      // console.log('result', result);
      sendResponse(result.pagesReadResult);
    })
    .catch(err => sendError(err));
};

module.exports = updateTraining;
