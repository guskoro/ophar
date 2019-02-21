const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateWorkingOrderInput = data => {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : '';
  data.priority_id = !isEmpty(data.priority_id) ? data.priority_id : '';
  data.users = !isEmpty(data.users) ? data.users : '';
  data.start = !isEmpty(data.start) ? data.start : '';

  if (!Validator.isLength(data.description, {
      min: 3,
      max: 30
    })) {
    errors.description = 'Deskripsi harus terdiri dari 3 sampai 30 karakter';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Deskripsi working order harus diisi';
  }

  if (Validator.isEmpty(data.priority_id)) {
    errors.priority_id = 'Prioritas harus diisi';
  }

  if (Validator.isEmpty(data.users)) {
    errors.users = 'Harus ada minimal satu user dalam working order';
  }

  if (Validator.isEmpty(data.start)) {
    errors.start = 'Waktu mulai working order harus diisi';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}