const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadScada20kvSchema = new Schema({
  pic: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  division: {
    type: String
  },
  division: {
    type: String
  },
  arid: {
    type: String
  },
  iid: {
    type: String
  },
  region: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  classification: {
    type: String
  },
  rootcause: {
    type: String
  },
  rootdetail: {
    type: String
  },
  impact: {
    type: String
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'types',
    required: true
  },
  start: {
    type: String
  },
  end: {
    type: String
  },
  arrequest: {
    type: String
  },
  ardestination: {
    type: String
  },
  arregion: {
    type: String
  },
  arcreate: {
    type: String
  },
  arclose: {
    type: String
  },
  arend: {
    type: String
  },
  recduration: {
    type: String
  },
  ttr: {
    type: String
  },
  kronologi: {
    type: String
  },
  improve: {
    type: String
  },
  saidi: {
    type: String
  },
  month: {
    type: String
  },
  week: {
    type: String
  }
});

module.exports = UploadScada20kv = mongoose.model(
  'upload-scada20kv',
  uploadScada20kvSchema
);
