const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

require('dotenv').config();

const users = require('./routes/api/users');
const roles = require('./routes/api/roles');
const workingOrders = require('./routes/api/workingOrders');
const types = require('./routes/api/types');
const priorities = require('./routes/api/priorities');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/user', users);
app.use('/api/role', roles);
app.use('/api/working-order', workingOrders);
app.use('/api/type', types);
app.use('/api/priority', priorities);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));