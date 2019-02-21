const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validatePriorityInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Nama prioritas harus diisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}