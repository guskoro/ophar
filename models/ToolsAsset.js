const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toolsAssetSchema = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  toolsname: {
    type: String,
    required: true
  },
  toolsmodel: {
    type: String
  },
  sn: {
    type: String
  },
  note: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = ToolsAsset = mongoose.model('tools_asset', toolsAssetSchema);
