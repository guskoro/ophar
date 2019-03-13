const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config();

const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

const User = require('../../models/User');
const Role = require('../../models/Role');
const Division = require('../../models/Division');

router.get('/', (req, res) => {
  let query = {};

  if (req.query.division) query.division = req.query.division;
  if (req.query.role) query.role = req.query.role;

  User.find(query)
    .select('-password')
    .populate('role', 'name')
    .populate('division', 'name')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err));
});

router.post(
  '/register',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .then(user => {
        if (user.role.name != 'admin')
          return res
            .status(403)
            .json({ access: 'Sorry, you dont have access to add user' });

        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }

        User.findOne({
          email: req.body.email
        })
          .then(user => {
            if (user) {
              errors.email = 'Email is already taken';

              return res.status(400).json(errors);
            }

            Role.findById(req.body.role)
              .then(role => {
                const avatar = gravatar.url(req.body.email, {
                  s: '200',
                  r: 'pg',
                  d: 'mm'
                });

                const newUser = new User({
                  name: req.body.name,
                  email: req.body.email,
                  avatar,
                  role,
                  password: req.body.password
                });

                if (req.body.division) {
                  newUser.division = req.body.division;
                }

                bcrypt.genSalt(10, (err, salt) => {
                  if (err) return res.status(400).json(err);
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) res.status(400).json(err);
                    newUser.password = hash;
                    newUser
                      .save()
                      .then(user => res.status(200).json(user))
                      .catch(err => res.status(400).json(err));
                  });
                });
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email
  })
    .populate('role')
    .populate('division')
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              name: user.name,
              avatar: user.avatar,
              role: user.role.name
            };

            return jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
              return res.json({
                user: user,
                token: `Bearer ${token}`
              });
            });
          }

          errors.password = 'Password is invalid';

          return res.status(400).json(errors);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    User.findById(req.user.id)
      .select('-password')
      .populate('role', 'name-_id')
      .populate('division', 'name-_id')
      .then(user => {
        let userResponse = {};

        userResponse._id = user._id;
        userResponse.name = user.name;
        userResponse.email = user.email;
        userResponse.avatar = user.avatar;
        userResponse.role = user.role.name;

        if (user.division) {
          userResponse.division = user.division.name;
        }
        res.json(userResponse);
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .select('-password')
    .then(user => res.status(200).json(user))
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
          return res.status(403).json({
            access: 'Sorry, you dont have access to update user data'
          });

        User.findById(req.params.id)
          .then(user => {
            if (req.body._id) {
              delete req.body._id;
            }
            if (req.body.division) {
              delete req.body.division;
            }
            for (let i in req.body) {
              user[i] = req.body[i];
              console.log(i);
            }
            user
              .save()
              .then(updatedUser => {
                res.json(updatedUser);
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
          return res.status(403).json({
            access: 'Sorry, you dont have access to delete user data'
          });

        User.findByIdAndDelete(req.params.id)
          .then(user => {
            res.json(user);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
