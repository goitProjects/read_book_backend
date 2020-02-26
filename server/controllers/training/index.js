const createTraining = require('./createTraing');
const updateTraining = require('./updateTraining');
const getTraining = require('./getTraining');
const deleteTraining = require('./deleteTraining');
const deleteTrainingTime = require('./deleteTrainingTime');
const addTrainingTime = require('./addTrainingTime');
const checkReadBookTraining = require('./checkReadBookTraining');

module.exports = {
  getTraining,
  updateTraining,
  deleteTraining,
  createTraining,
  deleteTrainingTime,
  addTrainingTime,
  checkReadBookTraining
};
