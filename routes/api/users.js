const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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

module.exports = router;