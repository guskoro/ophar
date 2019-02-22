const express = require('express');
const router = express.Router();

const validatePriorityInput = require('../../validations/priority');

const Priority = require('../../models/Priority');

router.get('/', (req, res) => {
  Priority.find()
    .then(priorities => res.status(200).json(priorities))
    .catch(err => res.status(400).json(err));
});

router.post('/', (req, res) => {
  const {
    errors,
    isValid
  } = validatePriorityInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPriority = new Priority({
    name: req.body.name
  });

  newPriority.save()
    .then(priority => res.status(200).json(priority))
    .catch(err => res.status(400).json(err));
});

module.exports = router;