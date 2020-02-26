const Training = require('../../models/training.model');
const getTraining = require('./getTraining');
const { ObjectId } = require('mongoose').Types;

const updateBookReadCheck = (req, res) => {
  const trainingId = req.params.trainingId;
  const trainingBookId = req.params.trainingBookId;
  const updatedData = req.body;

  const sendError = error => {
    const errMessage = error.message || 'must handle this error on login';
    res.status(400).json({
      status: 'error',
      message: errMessage,
      error: error
    });
  };
  console.log('updatedData', updatedData);
  console.log('bookId', trainingBookId);
  Training.updateOne(
    {
      _id: trainingId
    },
    {
      $set: { 'books.$[el].isRead': updatedData.isRead },
      $inc: {
        unreadCount: updatedData.isRead ? -1 : 1
      }
    },
    {
      arrayFilters: [{ 'el._id': trainingBookId }]
    },
    (err, doc) => {
      if (err) sendError(err);
      if (doc) getTraining(req, res);
    }
  );
  // .then(result => {
  //   console.log('result', result);

  //   if (result) getTraining(req, res);
  // })
  // .catch(err => sendError(err));
};

module.exports = updateBookReadCheck;
