const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String
    },
    year: {
      type: Number
    },
    pagesCount: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      min: 0,
      max: 5,
      default: 0
    },
    status: {
      type: String,
      enum: ['read', 'planned', 'reading'],
      default: 'planned'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: true
  }
);

BookSchema.pre('findOneAndUpdate', function() {
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

module.exports = mongoose.model('Books', BookSchema);
