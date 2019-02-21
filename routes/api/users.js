const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config();

const User = require('../../models/User');
const Role = require('../../models/Role');

router.get('/', (req, res) => {
  User.find()
    .populate('role', 'name-_id')
    .then(users => res.status(200).json(users))
    .catch(err => console.log(err));
});

router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email sudah terdaftar"
      });
    }

    Role.findById(req.body.role_id)
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

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash;
            newUser.save()
              .then(user => res.status(200).json(user))
              .catch(err => console.log(err));
          });
        });
      })
      .catch(err => console.log(err));

  }).catch(err => console.log(err));
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          email: "User tidak ditemukan"
        });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              name: user.name,
              avatar: user.avatar
            };

            return jwt.sign(payload, process.env.JWT_KEY,
              (err, token) => {
                return res.json({
                  user: user,
                  token: `Bearer ${token}`
                });
              });
          }

          return res.status(400).json({
            password: "Password salah"
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
});

module.exports = router;