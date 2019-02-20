const express = require('express');
const router = express.Router();

const Role = require('../../models/Role');

router.get('/', (req, res) => {
    Role.find()
        .then(roles => res.status(200).json(roles))
        .catch(err => console.log(err));
});

router.post('/', (req, res) => {
    const newRole = new Role({
        name: req.body.name
    });

    newRole.save()
        .then(role => res.status(200).json(role))
        .catch(err => console.log(err));
});

module.exports = router;