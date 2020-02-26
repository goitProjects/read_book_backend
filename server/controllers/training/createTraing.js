const Joi = require('joi');
// const { ValidationError } = require('../../core/error');
const Training = require('../../models/training.model');
const getTraining = require('./getTraining.js');
const User = require('../../models/user.model');
const Books = require('../../models/books.model');

const createTraining = (req, res) => {
  const userId = req.user.id;
  const schema = Joi.object()
    .keys({
      books: Joi.array().items(
        Joi.object().keys({
          book: Joi.string().required()
        })
      ),
      timeEnd: Joi.date().required(),
      timeStart: Joi.date().required(),
      readPagesCount: Joi.number().integer(),
      avgReadPages: Joi.number().required()
    })
    .options({
      stripUnknown: true,
      abortEarly: false
    });

  const result = schema.validate(req.body);

  const sendResponse = training => {
    res.status(201);
    res.json({
      status: 'success',
      training
    });
  };

  const sendError = error => {
    const errMessage = error.message || 'must handle this error on login';
    res.status(400).json({
      status: 'error',
      error: errMessage
    });
  };

  if (result.error) sendError(result.error);

  const newTraining = new Training({
    ...result.value,
    userId
  });

  newTraining
    .save()
    .then(newResult => {
      console.log('newResult :', newResult);
      if (newResult) {
        req.user.haveTraining = true;
        User.findByIdAndUpdate(
          userId,
          { $set: { haveTraining: true } },
          err => {
            if (err) sendError(err);
            const booksIds = newResult.books.map(book => book.book);

            Books.updateMany(
              { _id: { $in: booksIds } },
              { $set: { status: 'reading' } },
              { new: true, multi: true },
              (err, doc) => {
                if (err) sendError(err);

                getTraining(req, res);
              }
            );
          }
        );
      }
    })
    .catch(err => sendError(err));
};

module.exports = createTraining;
