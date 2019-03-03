const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');
const Role = require('../../models/Role');

const validateRoleInput = require('../../validations/role');

router.get('/', (req, res) => {
  Role.find()
    .then(roles => res.status(200).json(roles))
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

        const { errors, isValid } = validateRoleInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }

        const newRole = new Role({
          name: req.body.name
        });

        newRole
          .save()
          .then(role => res.status(200).json(role))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  Role.findById(req.params.id)
    .then(role => res.status(200).json(role))
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

        Role.findById(req.params.id)
          .then(role => {
            if (req.body._id) {
              delete req.body._id;
            }
            for (let i in req.body) {
              role[i] = req.body[i];
            }
            role
              .save()
              .then(updatedRole => {
                res.json(updatedRole);
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

        Role.findByIdAndDelete(req.params.id)
          .then(role => {
            res.json(role);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
