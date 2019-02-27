const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateLoginInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email harus diisi';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Kata sandi harus diisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}