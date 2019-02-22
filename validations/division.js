const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateDivisionInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.types = !isEmpty(data.types) ? data.types : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Nama divisi harus diisi';
  }

  if (Validator.isEmpty(data.types)) {
    errors.types = 'Setidaknya terdapat satu tipe dalam suatu divisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}