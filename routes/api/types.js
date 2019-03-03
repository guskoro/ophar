const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');
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

        const { errors, isValid } = validateTypeInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }

        const newType = new Type({
          name: req.body.name
        });

        newType
          .save()
          .then(type => res.status(200).json(type))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  Type.findById(req.params.id)
    .then(type => res.status(200).json(type))
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

        Type.findById(req.params.id)
          .then(type => {
            if (req.body._id) {
              delete req.body._id;
            }
            for (let i in req.body) {
              type[i] = req.body[i];
            }
            type
              .save()
              .then(updatedType => {
                res.json(updatedType);
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

        Type.findByIdAndDelete(req.params.id)
          .then(type => {
            res.json(type);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
