const express = require('express');
const router = express.Router();
const passport = require('passport');

const validatePriorityInput = require('../../validations/priority');

const User = require('../../models/User');
const Priority = require('../../models/Priority');

router.get('/', (req, res) => {
  Priority.find()
    .then(priorities => res.status(200).json(priorities))
    .catch(err => res.status(400).json(err));
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .then(user => {
        if (user.role.name != 'admin')
          return res
            .status(403)
            .json({ access: 'Maaf, anda tidak mempunyai access untuk ini' });

        const { errors, isValid } = validatePriorityInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }

        const newPriority = new Priority({
          name: req.body.name
        });

        newPriority
          .save()
          .then(priority => res.status(200).json(priority))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  Priority.findById(req.params.id)
    .then(priority => res.status(200).json(priority))
    .catch(err => res.status(404).json(err));
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .then(user => {
        if (user.role.name != 'admin')
          return res
            .status(403)
            .json({ access: 'Maaf, anda tidak mempunyai access untuk ini' });

        Priority.findById(req.params.id)
          .then(priority => {
            if (req.body._id) {
              delete req.body._id;
            }
            for (let i in req.body) {
              priority[i] = req.body[i];
            }
            priority
              .save()
              .then(updatedPriority => {
                res.json(updatedPriority);
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .then(user => {
        if (user.role.name != 'admin')
          return res
            .status(403)
            .json({ access: 'Maaf, anda tidak mempunyai access untuk ini' });

        Priority.findByIdAndDelete(req.params.id)
          .then(priority => {
            res.json(priority);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
