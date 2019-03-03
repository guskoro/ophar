const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateWorkingOrderInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.priority = !isEmpty(data.priority) ? data.priority : '';
  data.type = !isEmpty(data.type) ? data.type : '';
  data.program = !isEmpty(data.program) ? data.program : '';
  // data.users = !isEmpty(data.users) ? data.users : '';
  data.deadline = !isEmpty(data.deadline) ? data.deadline : '';

  if (Validator.isEmpty(data.title))
    errors.title = 'Title working order harus diisi';

  if (
    !Validator.isLength(data.description, {
      min: 3,
      max: 30
    })
  )
    errors.description = 'Deskripsi harus terdiri dari 3 sampai 30 karakter';

  if (Validator.isEmpty(data.description))
    errors.description = 'Deskripsi working order harus diisi';

  if (Validator.isEmpty(data.priority))
    errors.priority = 'Prioritas working order harus diisi';

  if (Validator.isEmpty(data.type))
    errors.type = 'Tipe working order harus diisi';

  if (Validator.isEmpty(data.program))
    errors.program = 'Program working order harus diisi';

  // if (Validator.isEmpty(data.users))
  //   errors.users = 'Harus ada minimal satu user dalam working order';

  if (Validator.isEmpty(data.deadline))
    errors.deadline = 'Deadline working order harus diisi';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
