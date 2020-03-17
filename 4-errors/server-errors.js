const fs = require('fs').promises;

exports.serverErrors = (err, req, res, next) => {
  const errors = {
    noUser: { status: 404, msg: 'username not found' },
    noArticle: { status: 404, msg: 'article not found' }
  };

  if (err in errors) {
    res.status(errors[err].status).send({ error: errors[err].msg });
  } else {
    fs.appendFile('./4-errors/error-log.txt', `${new Date()}:\n${err}\n\n`);
    res.status(500).send({ 'internal error': 'this error has been logged' });
  }
};
