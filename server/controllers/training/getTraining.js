const Training = require('../../models/training.model');
const ObjId = require('mongoose').Types.ObjectId;
const Books = require('../../models/books.model');

const getTraining = (req, res) => {
  const userId = req.user.id;
  const haveTraining = req.user.haveTraining;

  const sendResponse = training => {
    console.log('training', training);
    if (haveTraining && training.length !== 0)
      return res.status(200).json({
        status: 'OK',
        training: training[0] || null,
        userData: {
          haveTraining: haveTraining
        }
      });

    res.status(200).json({
      status: 'OK',
      training: training[0] || null
    });
  };

  const sendError = error => {
    const errMessage = error.message || 'must handle this error get Training';
    res.status(400).json({
      status: 'error',
      error: error,
      message: errMessage
    });
  };

  // Training.find({
  //   userId,
  //   isDone: false
  // })
  // .populate('books.book', { title: 1, author: 1, year: 1, pagesCount: 1 })
  //   .project({ 'books.book.__v': 0 })
  //   .limit(1)
  //   .select({ __v: 0, createdAt: 0, updatedAt: 0 })
  //   .then(result => sendResponse(result[0]))
  //   .catch(err => sendError(err));

  Training.aggregate([
    { $match: { isDone: false, userId: ObjId(userId) } },
    {
      $unwind: '$books'
    },
    {
      $lookup: {
        from: Books.collection.name,
        let: { bookId: '$books.book' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$bookId'] } } }],
        as: 'books.book'
      }
    },
    { $unwind: '$books.book' },
    { $addFields: { 'books.book': '$books.book' } },
    {
      $project: {
        _id: true,
        isDone: 1,
        timeStart: '$timeStart',
        timeEnd: '$timeEnd',
        avgReadPages: '$avgReadPages',
        readPagesCount: '$readPagesCount',
        pagesReadResult: '$pagesReadResult',
        booksCount: '$booksCount',
        unreadCount: '$unreadCount',
        'books.book.bookId': '$books.book._id',
        'books.book.title': '$books.book.title',
        'books.book.pagesCount': '$books.book.pagesCount',
        'books.book.author': '$books.book.author',
        'books.book.year': '$books.book.year',
        'books.isRead': '$books.isRead',
        'books.trainingBookId': '$books._id'
      }
    },
    // {
    //   $addFields: {
    //     userRead: { $sum: '$pagesReadResult.count' }
    //   }
    // },
    {
      $group: {
        _id: {
          _id: '$_id',
          isDone: '$isDone',
          timeStart: '$timeStart',
          timeEnd: '$timeEnd',
          avgReadPages: '$avgReadPages',
          readPagesCount: '$readPagesCount',
          pagesReadResult: '$pagesReadResult',
          booksCount: '$booksCount',
          unreadCount: '$unreadCount'
        },
        // pagesReadResult: {
        //   $push: {
        //     date: {
        //       yearMonthDay: {
        //         $dateToString: {
        //           format: '%Y-%m-%d',
        //           date: '$pagesReadResult.date'
        //         }
        //       },
        //       time: {
        //         $dateToString: {
        //           format: '%H:%M:%S:%L%z',
        //           date: '$pagesReadResult.date',
        //           timezone: 'Europe/Kiev'
        //         }
        //       }
        //     },
        //     count: '$pagesReadResult.count',
        //     _id: '$pagesReadResult._id'
        //   }
        // },
        books: { $push: '$books' },
        allPagesCount: { $sum: '$books.book.pagesCount' }
      }
    },
    {
      $project: {
        _id: false,
        trainingId: '$_id._id',
        isDone: '$_id.isDone',
        timeStart: '$_id.timeStart',
        timeEnd: '$_id.timeEnd',
        avgReadPages: '$_id.avgReadPages',
        readPagesCount: '$_id.readPagesCount',
        booksCount: '$_id.booksCount',
        unreadCount: '$_id.unreadCount',
        userRead: '$_id.userRead',
        books: '$books',
        allPagesCount: '$allPagesCount',
        pagesReadResult: '$_id.pagesReadResult'
      }
    },
    {
      $project: {
        'books.book.__v': 0,
        'books.book.userId': 0,
        'books.book.createdAt': 0,
        'books.book.updatedAt': 0,
        'books.book.status': 0
      }
    }
    // { $unwind: '$pagesReadResult' },
    // { $addFields: { pagesReadResult: '$pagesReadResult' } },
    // {
    //   $group: {
    //     _id: {
    //       _id: '$_id',
    //       isDone: '$isDone',
    //       timeStart: '$timeStart',
    //       timeEnd: '$timeEnd',
    //       avgReadPages: '$avgReadPages',
    //       readPagesCount: '$readPagesCount',
    //       // pagesReadResult: '$pagesReadResult',
    //       booksCount: '$booksCount',
    //       unreadCount: '$unreadCount',
    //       allPagesCount: '$allPagesCount',
    //       userRead: '$userRead',
    //       books: '$books'
    //     },
    //     userRead: { $sum: '$pagesReadResult.count' },
    //     pagesReadResult: {
    //       $push: {
    //         date: {
    //           yearMonthDay: {
    //             $dateToString: {
    //               format: '%d-%m-%Y',
    //               date: '$pagesReadResult.date'
    //             }
    //           },
    //           time: {
    //             $dateToString: {
    //               format: '%H:%M:%S',
    //               date: '$pagesReadResult.date',
    //               timezone: 'Europe/Kiev'
    //             }
    //           }
    //         },
    //         count: '$pagesReadResult.count',
    //         _id: '$pagesReadResult._id'
    //       }
    //     }
    //   }
    // },
    // {
    //   $project: {
    //     _id: '$_id._id',
    //     isDone: '$_id.isDone',
    //     timeStart: '$_id.timeStart',
    //     timeEnd: '$_id.timeEnd',
    //     avgReadPages: '$_id.avgReadPages',
    //     readPagesCount: '$_id.readPagesCount',
    //     booksCount: '$_id.booksCount',
    //     unreadCount: '$_id.unreadCount',
    //     allPagesCount: '$_id.allPagesCount',
    //     userRead: '$userRead',
    //     books: '$_id.books',
    //     pagesReadResult: '$pagesReadResult'
    //   }
    // }

    // { $limit: 1 }
  ])
    .then(result => sendResponse(result))
    .catch(err => sendError(err));
};

module.exports = getTraining;
