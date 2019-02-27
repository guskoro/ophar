const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingOrderSchema = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'types',
    required: true
  },
  priority: {
    type: Schema.Types.ObjectId,
    ref: 'priorities',
    required: true
  },
  jobs: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
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
  expected_done: {
    type: Date
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