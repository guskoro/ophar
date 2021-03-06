const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingOrderSchema = new Schema({
  wo_id: {
    type: String,
    required: true
  },
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
      name: String,
      done: Boolean
    }
  ],
  plans_string: String,
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
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
  notes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      message: String,
      created_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  approved_by_spv: {
    type: Boolean,
    default: false
  },
  approved_by_manager: {
    type: Boolean,
    default: false
  },
  approved_by_engineer: {
    type: Boolean,
    default: false
  },
  rejected_by_engineer: {
    type: Boolean,
    default: false
  },
  rejected: {
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
  },
  report: String
});

module.exports = WorkingOrder = mongoose.model(
  'working_orders',
  workingOrderSchema
);
