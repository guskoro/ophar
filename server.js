const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const pretty = require('express-prettify');
const cors = require('cors');

require('dotenv').config();

const users = require('./routes/api/users');
const roles = require('./routes/api/roles');
const workingOrders = require('./routes/api/workingOrders');
const divisions = require('./routes/api/divisions');
const priorities = require('./routes/api/priorities');
const types = require('./routes/api/types');

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(pretty({ query: 'pretty', always: true }));

const db = process.env.MONGO_URI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/user', users);
app.use('/api/role', roles);
app.use('/api/working-order', workingOrders);
app.use('/api/division', divisions);
app.use('/api/priority', priorities);
app.use('/api/type', types);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
