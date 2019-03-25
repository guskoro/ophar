const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateWorkingOrderInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.priority = !isEmpty(data.priority) ? data.priority : '';
  data.type = !isEmpty(data.type) ? data.type : '';
  data.program = !isEmpty(data.program) ? data.program : '';
  data.users = !isEmpty(data.users) ? data.users : '';
  data.deadline = !isEmpty(data.deadline) ? data.deadline : '';

  if (Validator.isEmpty(data.title)) errors.title = 'Title is required';

  if (
    !Validator.isLength(data.description, {
      min: 3
    })
  )
    errors.description = 'Description must be atleast 3 characters';

  if (Validator.isEmpty(data.description))
    errors.description = 'Description is required';

  if (Validator.isEmpty(data.priority))
    errors.priority = 'Priority is required';

  if (Validator.isEmpty(data.type)) errors.type = 'Type is required';

  if (Validator.isEmpty(data.program)) errors.program = 'Program is required';

  // if (Validator.isEmpty(data.users))
  //   errors.users = 'Harus ada minimal satu user dalam';

  if (Validator.isEmpty(data.deadline))
    errors.deadline = 'Deadline is required';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
