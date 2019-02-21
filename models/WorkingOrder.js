const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingOrderSchema = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  priority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'priorities'
  },
  jobs: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  approved_by_spv: {
    type: Boolean,
    default: false
  },
  approved_by_manager: {
    type: Boolean,
    default: false
  },
  done: {
    type: Boolean,
    default: false
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = WorkingOrder = mongoose.model('working_orders', workingOrderSchema);