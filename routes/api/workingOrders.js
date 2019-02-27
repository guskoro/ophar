const express = require('express');
const router = express.Router();
const passport = require('passport');

const validateWorkingOrderInput = require('../../validations/working-order');

const WorkingOrder = require('../../models/WorkingOrder');
const Priority = require('../../models/Priority');
const User = require('../../models/User');
const Type = require('../../models/Type');

router.get('/', (req, res) => {
  let query = {};

  if (req.query.approved_by_manager) query.approved_by_manager = req.query.approved_by_manager;
  if (req.query.approved_by_spv) query.approved_by_spv = req.query.approved_by_spv;
  if (req.query.done) query.done = req.query.done;

  WorkingOrder.find(query)
    .populate('pic', 'name-_id')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .populate('users', 'name-_id')
    .then(workingOrders => res.json(workingOrders))
    .catch(err => res.status(404).json(err));
});

router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateWorkingOrderInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findById(req.user.id)
    .populate('role', 'name-_id')
    .then(pic => {
      if (pic.role.name !== 'pic') {
        errors.pic = 'Maaf, anda bukan PIC'

        res.status(403).json(errors);
      }
      Priority.findById(req.body.priority)
        .then(priority => {
          const users = req.body.users.split(',');

          User.find({
              _id: {
                $in: users
              }
            })
            .then(users => {
              Type.findById(req.body.type)
                .then(type => {
                  const newWorkingOrder = new WorkingOrder({
                    pic,
                    type,
                    priority,
                    description: req.body.description,
                    start: req.body.start
                  });

                  if (req.body.jobs) {
                    const jobs = req.body.jobs.split(',');

                    jobs.map(job => {
                      newWorkingOrder.jobs.push(job);
                    });
                  }

                  if (req.body.expected_done) {
                    newWorkingOrder.expected_done = req.body.expected_done;
                  }

                  users.map(user => {
                    newWorkingOrder.users.push(user);
                  });

                  newWorkingOrder.save()
                    .then(newWorkingOrder => res.status(201).json(newWorkingOrder))
                    .catch(err => res.status(400).json(err));
                })
                .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json(err));
        })
        .catch(err => res.status(404).json(err))
    })
    .catch(err => res.status(404).json(err));
});

router.get('/:id', (req, res) => {
  WorkingOrder.findById(req.params.id)
    .populate('pic', 'name-_id')
    .populate('priority', 'name-_id')
    .populate('users', 'name-_id')
    .then(workingOrder => res.status(200).json(workingOrder))
    .catch(err => res.status(404).json(err));
});

router.patch('/:id', (req, res) => {
  WorkingOrder.findById(req.params.id)
    .then(workingOrder => {
      if (req.body._id) {
        delete req.body._id
      }
      for (let i in req.body) {
        workingOrder[i] = req.body[i]
      }
      workingOrder.save()
        .then(updatedWorkingOrder => {
          res.json(updatedWorkingOrder);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(404).json(err));
});

router.post('/approve/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  WorkingOrder.findById(req.params.id)
    .then(workingOrder => {
      User.findById(req.user.id)
        .populate('role', 'name-_id')
        .then(user => {
          if (user.role.name === 'manager') {
            workingOrder.approved_by_manager = !workingOrder.approved_by_manager;
          } else if (user.role.name === 'supervisor') {
            workingOrder.approved_by_spv = !workingOrder.approved_by_spv;
          } else {
            return res.status(403).json({
              message: 'Maaf, anda tidak mempunyai otoritas untuk approve working order'
            });
          }
          workingOrder.save()
            .then(newWorkingOrder => res.status(200).json(newWorkingOrder))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

router.post('/done/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  WorkingOrder.findById(req.params.id)
    .populate('pic', 'division-_id')
    .then(workingOrder => {
      User.findById(req.user.id)
        .then(pic => {
          if (pic.division.name !== workingOrder.pic.division.name) {
            return res.status(403).json({
              message: 'Maaf, anda bukan PIC untuk working order ini'
            });
          }

          if (!(workingOrder.approved_by_manager && workingOrder.approved_by_spv)) {
            return res.status(400).json({
              message: 'Maaf, working order anda belum di-approve'
            });
          }

          workingOrder.done = !workingOrder.done;
          workingOrder.end = new Date();
          workingOrder.save()
            .then(newWorkingOrder => res.status(200).json(newWorkingOrder))
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;