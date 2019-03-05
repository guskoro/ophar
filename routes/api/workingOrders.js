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

  if (req.query.approved_by_manager)
    query.approved_by_manager = req.query.approved_by_manager;
  if (req.query.approved_by_spv)
    query.approved_by_spv = req.query.approved_by_spv;
  if (req.query.done) query.done = req.query.done;
  if (req.query.division)
    query.division = {
      $regex: req.query.division,
      $options: 'i'
    };
  if (req.query.overdue) query.deadline = { $lte: new Date() };

  WorkingOrder.find(query)
    .populate('pic')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .then(workingOrders => res.json(workingOrders))
    .catch(err => res.status(404).json(err));
});

router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateWorkingOrderInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findById(req.user.id)
      .populate('role', 'name-_id')
      .populate('division', 'name-_id')
      .then(pic => {
        if (pic.role.name !== 'engineer') {
          errors.pic = 'Maaf, anda bukan Engineer kami';

          res.status(403).json(errors);
        }
        Priority.findById(req.body.priority)
          .then(priority => {
            console.log(pic);
            Type.findById(req.body.type)
              .then(type => {
                const newWorkingOrder = new WorkingOrder({
                  pic,
                  type,
                  priority,
                  division: pic.division.name,
                  title: req.body.title,
                  description: req.body.description,
                  program: req.body.program,
                  deadline: req.body.deadline
                });

                if (req.body.plans) {
                  const plans = req.body.plans.split(',');

                  plans.map(plan => {
                    newWorkingOrder.plans.push(plan);
                  });
                }

                // users.map(user => {
                //   newWorkingOrder.users.push(user);
                // });

                newWorkingOrder
                  .save()
                  .then(newWorkingOrder => {
                    res.status(201).json(newWorkingOrder);
                  })
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
  WorkingOrder.findById(req.params.id)
    .populate('pic')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .then(workingOrder => res.json(workingOrder))
    .catch(err => res.status(404).json(err));
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .then(workingOrder => {
        if (req.body._id) {
          delete req.body._id;
        }
        for (let i in req.body) {
          workingOrder[i] = req.body[i];
        }
        workingOrder
          .save()
          .then(updatedWorkingOrder => {
            res.json(updatedWorkingOrder);
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  '/approve/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .then(workingOrder => {
        User.findById(req.user.id)
          .populate('role', 'name-_id')
          .then(user => {
            if (user.role.name === 'manager' && workingOrder.approved_by_spv) {
              workingOrder.approved_by_manager = !workingOrder.approved_by_manager;
              workingOrder.start = new Date();
            } else if (user.role.name === 'supervisor') {
              workingOrder.approved_by_spv = !workingOrder.approved_by_spv;
            } else {
              return res.status(403).json({
                message:
                  'Maaf, anda tidak mempunyai otoritas untuk approve working order'
              });
            }
            workingOrder
              .save()
              .then(newWorkingOrder => res.status(200).json(newWorkingOrder))
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  '/done/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .populate('pic', 'division-_id')
      .then(workingOrder => {
        User.findById(req.user.id)
          .then(pic => {
            if (pic.division.email !== workingOrder.pic.division.email) {
              return res.status(403).json({
                message: 'Maaf, anda bukan PIC untuk working order ini'
              });
            }

            if (
              !(
                workingOrder.approved_by_manager && workingOrder.approved_by_spv
              )
            ) {
              return res.status(400).json({
                message: 'Maaf, working order anda belum di-approve'
              });
            }

            workingOrder.done = !workingOrder.done;
            workingOrder.end = new Date();
            workingOrder
              .save()
              .then(newWorkingOrder => res.status(200).json(newWorkingOrder))
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
