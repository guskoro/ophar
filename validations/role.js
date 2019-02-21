const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRoleInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Nama role harus diisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}