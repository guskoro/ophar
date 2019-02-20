const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const roles = require('./routes/api/roles');
const workingOrders = require('./routes/api/workingOrders');
const types = require('./routes/api/types');
const priorities = require('./routes/api/priorities');

const app = express();

require('dotenv').config();
const db = process.env.MONGO_URI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

app.use('/api/users', users);
app.use('/api/roles', roles);
app.use('/api/working-orders', workingOrders);
app.use('/api/types', types);
app.use('/api/priorities', priorities);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));