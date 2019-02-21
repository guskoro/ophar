const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrioritySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Priority = mongoose.model('priorities', PrioritySchema);