const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles'
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'divisions'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = User = mongoose.model('users', UserSchema)