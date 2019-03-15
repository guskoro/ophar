const express = require('express');
const router = express.Router();
const passport = require('passport');
const Pusher = require('pusher');

const validateWorkingOrderInput = require('../../validations/working-order');

const WorkingOrder = require('../../models/WorkingOrder');
const Priority = require('../../models/Priority');
const User = require('../../models/User');
const Type = require('../../models/Type');

const pusher = new Pusher({
  appId: '735656',
  key: '12f41be129ba1c0d7a3c',
  secret: '553907407b97d9a87bd9',
  cluster: 'ap1',
  encrypted: true
});

router.get('/', (req, res) => {
  let query = {};

  if (req.query.approved_by_manager)
    query.approved_by_manager = req.query.approved_by_manager;
  if (req.query.approved_by_spv)
    query.approved_by_spv = req.query.approved_by_spv;
  if (req.query.done) query.done = req.query.done;
  if (req.query.rejected) query.rejected = req.query.rejected;
  if (req.query.division)
    query.division = {
      $regex: req.query.division,
      $options: 'i'
    };
  if (req.query.overdue) query.deadline = { $lte: new Date() };

  WorkingOrder.find(query)
    .populate({
      path: 'pic',
      populate: {
        path: 'division'
      }
    })
    .sort('-created_at')
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
          errors.pic = 'Sorry, you are not engineer';

          res.status(403).json(errors);
        }
        Priority.findById(req.body.priority)
          .then(priority => {
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
                  // const plans = req.body.plans.split(',');

                  req.body.plans.map(plan => {
                    newWorkingOrder.plans.push({
                      name: plan.value,
                      done: false
                    });
                  });
                }

                // users.map(user => {
                //   newWorkingOrder.users.push(user);
                // });

                newWorkingOrder
                  .save()
                  .then(newWorkingOrder => {
                    pusher.trigger('ophar-app', 'add-wo', newWorkingOrder);
                    return res.status(201).json(newWorkingOrder);
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
    .then(workingOrder => {
      const woCustom = {
        _id: workingOrder._id,
        title: workingOrder.title,
        description: workingOrder.description,
        division: workingOrder.division,
        type: workingOrder.type.name,
        priority: workingOrder.priority.name,
        plans: workingOrder.plans,
        program: workingOrder.program,
        note: workingOrder.note,
        approved_by_spv: workingOrder.approved_by_spv,
        approved_by_manager: workingOrder.approved_by_manager,
        rejected: workingOrder.rejected,
        done: workingOrder.done,
        start: workingOrder.start,
        deadline: workingOrder.deadline,
        end: workingOrder.end,
        created_at: workingOrder.created_at,
        pic_name: workingOrder.pic.name,
        pic_email: workingOrder.pic.email,
        pic_avatar: workingOrder.pic.avatar
      };

      return res.json(woCustom);
    })
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
        if (req.body.plans) {
          req.body.plans.map((plan, id) => {
            workingOrder.plans[id].done = plan.done;
          });
          delete req.body.plans;
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
  '/reject/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .then(workingOrder => {
        User.findById(req.user.id)
          .populate('role', 'name-_id')
          .then(user => {
            if (
              user.role.name === 'manager' ||
              user.role.name === 'supervisor'
            ) {
              workingOrder.rejected = !workingOrder.rejected;
            } else {
              return res.status(403).json({
                message:
                  'Maaf, anda tidak mempunyai otoritas untuk reject working order'
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
              ) ||
              workingOrder.rejected
            ) {
              return res.status(400).json({
                message:
                  'Maaf, working order anda belum di-approve atau telah di-reject'
              });
            }
            workingOrder.plans.map(plan => {
              plan.done = true;
            });
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

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate('division', 'name-_id')
      .then(user => {
        WorkingOrder.findById(req.params.id)
          .then(workingOrder => {
            if (user.division.name != workingOrder.division)
              return res.status(403).json({
                access:
                  'Sorry, you dont have access to delete this working order'
              });

            workingOrder.delete();
            workingOrder.save();
            return res.json(workingOrder);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
