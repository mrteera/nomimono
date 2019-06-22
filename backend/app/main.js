const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const dbHelper = require('./db/db-helper');

const userRepository = require('./repository/user-repository');
const lrRepo = require('./repository/lending-request-respository');
const brRepo = require('./repository/borrowing-request-repository');

const dialogFlowRoute = require('./routes/dialogflow-hook');
const loginRoute = require('./routes/login');
const brRoute = require('./routes/borrowing-request');
const lrRoute = require('./routes/lending-request');

const app = express();
const port = parseInt(process.env['PORT'] || 3333);

const db = dbHelper.db;

app.use(morgan('dev'));
app.use(bodyParser.json({ extended: false }));

app.use('/login', loginRoute);
app.use('/br', brRoute);
app.use('/lr', lrRoute);
app.use('/df', dialogFlowRoute);

db.loadDatabase({  }, (err) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  } else {
    userRepository.init();
    lrRepo.init();
    brRepo.init();

    app.listen(port, () => console.log(`Listening on port ${port}`));
  }
});
