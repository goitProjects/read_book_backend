const router = require('express').Router();

const {
  getTraining,
  updateTraining,
  deleteTraining,
  createTraining,
  addTrainingTime,
  deleteTrainingTime,
  checkReadBookTraining
} = require('../controllers/training');

router
  .get('/', getTraining)
  .patch('/:trainingId', updateTraining)
  .delete('/:trainingId', deleteTraining)
  .post('/', createTraining)
  .post('/time/:trainingId', addTrainingTime)
  .delete('/time/:trainingId', deleteTrainingTime)
  .patch('/:trainingId/book/:trainingBookId', checkReadBookTraining);

module.exports = router;
