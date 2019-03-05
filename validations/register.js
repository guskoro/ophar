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
    errors.name = 'Name must be atleast 2 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (
    !Validator.isLength(data.password, {
      min: 8
    })
  ) {
    errors.password = 'Password must be atleast 8 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Password must match';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Password confirmation is required';
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = 'Role user is required';
  }

  // if (Validator.isEmpty(data.division)) {
  //   errors.division = 'Divisi user harus diisi';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
