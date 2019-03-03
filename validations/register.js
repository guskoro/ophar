const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.role = !isEmpty(data.role) ? data.role : '';
  // data.division = !isEmpty(data.division) ? data.division : '';

  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 45
    })
  ) {
    errors.name = 'Nama harus lebih dari 2 karakter';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Nama harus diisi';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email yang didaftarkan harus benar';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email harus diisi';
  }

  if (
    !Validator.isLength(data.password, {
      min: 8
    })
  ) {
    errors.password = 'Kata sandi harus lebih dari 8 karakter';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Kata sandi harus diisi';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Konfirmasi Kata sandi harus sesuai';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Konfirmasi kata sandi harus diisi';
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = 'Role user harus diisi';
  }

  // if (Validator.isEmpty(data.division)) {
  //   errors.division = 'Divisi user harus diisi';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
