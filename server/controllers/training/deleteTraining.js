const Training = require('../../models/training.model');

const deleteTraining = (req, res) => {
  const userId = req.user.id;
  const trainingId = req.params.trainingId;

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

  Training.findOneAndDelete({ _id: trainingId, userId })
    .then(result => {
      sendResponse(result);
    })
    .catch(err => sendError(err));
};

module.exports = deleteTraining;
