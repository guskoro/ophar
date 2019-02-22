const express = require('express');
const router = express.Router();

const validateDivisionInput = require('../../validations/division');

const Division = require('../../models/Division');
const Type = require('../../models/Type');

router.get('/', (req, res) => {
  Division.find()
    .populate('types', 'name-_id')
    .then(divisions => res.status(200).json(divisions))
    .catch(err => res.status(400).json(err));
});

router.post('/', (req, res) => {
  const {
    errors,
    isValid
  } = validateDivisionInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const types = req.body.types.split(',');

  const newDivision = new Division({
    name: req.body.name
  });

  types.map(type => {
    newDivision.types.push(type);
  });

  newDivision.save()
    .then(division => res.status(200).json(division))
    .catch(err => res.status(400).json(err));
});

module.exports = router;