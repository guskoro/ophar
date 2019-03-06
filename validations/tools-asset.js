const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateToolsAssetInput = data => {
  let errors = {};

  data.toolsname = !isEmpty(data.toolsname) ? data.toolsname : '';

  if (Validator.isEmpty(data.toolsname))
    errors.toolsname = 'Nama Tools harus diisi';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
