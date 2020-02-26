const Training = require('../../models/training.model');
const { ObjectId } = require('mongoose').Types;

const deleteTraining = (req, res) => {
  const userId = req.user.id;
  const trainingId = req.params.trainingId;
  const trainingTimeId = req.body.trainingTimeId;

  const sendResponse = books => {
    res.status(200);
    res.json({
      status: 'success',
      pageReadResult: books
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
    { _id: ObjectId(trainingId), userId },
    { $pull: { 'pagesReadResult._id': trainingTimeId } }
  )
    .then(result => {
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = deleteTraining;
