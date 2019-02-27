const express = require('express');
const router = express.Router();

const Type = require('../../models/Type');
const Division = require('../../models/Division');

const validateTypeInput = require('../../validations/type');

router.get('/', (req, res) => {
  if (req.query.division) {
    Division.find({
        name: req.query.division
      })
      .populate('types')
      .then(division => {
        return res.json(division.types);
      })
      .catch(err => res.status(404).json(err));
  }

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