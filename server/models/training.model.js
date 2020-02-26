const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { ObjectId } = Schema.Types;

const TrainingSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'Users'
    },
    pagesReadResult: [
      {
        date: { type: Date },
        count: { type: Number }
      }
    ],
    books: [
      {
        book: {
          type: ObjectId,
          ref: 'Books'
        },
        isRead: {
          type: Boolean,
          default: false
        }
      }
    ],
    timeEnd: {
      required: true,
      type: Date
    },
    booksCount: {
      type: Number,
      default: function() {
        return this.books.length;
      }
    },
    timeStart: {
      type: Number
    },
    unreadCount: {
      type: Number,
      default: function() {
        const value = this.books.reduce((acc, book) => {
          let number = 0;
          if (!book.isRead) number = 1;

          return acc + number;
        }, 0);
        return value;
      }
    },
    readPagesCount: {
      type: Number
    },
    avgReadPages: {
      type: Number
    },
    isDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

TrainingSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) delete update.__v;

  const keys = ['$set', '$setOnInsert'];
  for (const key of keys)
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) delete update[key];
    }

  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

module.exports = mongoose.model('Trainings', TrainingSchema);
