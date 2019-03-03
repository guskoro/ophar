const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingOrderSchema = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  division: {
    type: String
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
  plans: [
    {
      type: String
    }
  ],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
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
    type: Date
  },
  deadline: {
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

module.exports = WorkingOrder = mongoose.model(
  'working_orders',
  workingOrderSchema
);
