const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateUploadScadaInput = data => {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : '';
  data.type = !isEmpty(data.type) ? data.type : '';

  if (
    !Validator.isLength(data.description, {
      min: 3
    })
  )
    errors.description = 'Description must be atleast 3 characters';

  if (Validator.isEmpty(data.description))
    errors.description = 'Description is required';

  if (Validator.isEmpty(data.type)) errors.type = 'Type is required';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
