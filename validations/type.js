const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateTypeInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Nama tipe harus diisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}