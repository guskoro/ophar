const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DivisionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  types: [{
    type: Schema.Types.ObjectId,
    ref: 'types'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Division = mongoose.model('divisions', DivisionSchema);