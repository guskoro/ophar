const express = require('express');
const router = express.Router();

const Role = require('../../models/Role');

const validateRoleInput = require('../../validations/role');

router.get('/', (req, res) => {
  Role.find()
    .then(roles => res.status(200).json(roles))
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
  const {
    errors,
    isValid
  } = validateRoleInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newRole = new Role({
    name: req.body.name
  });

  newRole.save()
    .then(role => res.status(200).json(role))
    .catch(err => console.log(err));
});

module.exports = router;