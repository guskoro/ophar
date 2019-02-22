const express = require('express');
const router = express.Router();

const Type = require('../../models/Type');

const validateTypeInput = require('../../validations/type');

router.get('/', (req, res) => {
  Type.find()
    .then(types => res.status(200).json(types))
    .catch(err => res.status(400).json(err));
});

router.post('/', (req, res) => {
  const {
    errors,
    isValid
  } = validateTypeInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newType = new Type({
    name: req.body.name
  });

  newType.save()
    .then(type => res.status(200).json(type))
    .catch(err => res.status(400).json(err));
});

module.exports = router;