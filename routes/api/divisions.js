const express = require('express');
const router = express.Router();
const passport = require('passport');

const validateDivisionInput = require('../../validations/division');

const User = require('../../models/User');
const Division = require('../../models/Division');
const Type = require('../../models/Type');

router.get('/', (req, res) => {
  Division.find()
    .populate('types', 'name-_id')
    .then(divisions => res.status(200).json(divisions))
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

        const { errors, isValid } = validateDivisionInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }

        const types = req.body.types.split(',');

        const newDivision = new Division({
          name: req.body.name
        });

        Type.find({
          _id: {
            $in: types
          }
        })
          .then(types => {
            types.map(type => {
              newDivision.types.push(type);
            });

            newDivision
              .save()
              .then(division => res.status(200).json(division))
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.patch(
  '/type/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .then(user => {
        if (user.role.name != 'admin')
          return res
            .status(403)
            .json({ access: 'Maaf, anda tidak mempunyai access untuk ini' });

        Division.findById(req.params.id)
          .then(division => {
            if (!division)
              res.status(404).json({
                message: 'Tidak ditemukan divisi yang akan di-update'
              });

            const types = req.body.types.split(',');

            Type.find({
              _id: {
                $in: types
              }
            })
              .then(types => {
                types.map(type => {
                  division.types.push(type);
                });

                division
                  .save()
                  .then(division => res.status(200).json(division))
                  .catch(err => res.status(400).json(err));
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  Division.findById(req.params.id)
    .then(division => res.status(200).json(division))
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

        Division.findById(req.params.id)
          .then(division => {
            if (req.body._id) {
              delete req.body._id;
            }
            for (let i in req.body) {
              division[i] = req.body[i];
            }
            division
              .save()
              .then(updatedDivision => {
                res.json(updatedDivision);
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

        Division.findByIdAndDelete(req.params.id)
          .then(division => {
            res.json(division);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
