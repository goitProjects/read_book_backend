const User = require('../../models/user.model');

const getUsers = (req, res) => {
  const sendResponse = data => {
    res.json({
      status: 'success',
      data
    });
  };

  const sendError = error => {
    const errMessage =
      error.message || 'must handle this error on registration';
    res.json({
      status: 'error',
      error: errMessage
    });
  };

  User.find()
    .then(data => {
      // if (!user) {
      //   sendError({
      //     message: 'No such user'
      //   });
      //   return;
      // }
      sendResponse(data);
    })
    .catch(sendError);
};

module.exports = getUsers;
