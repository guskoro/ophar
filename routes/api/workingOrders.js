const express = require('express');
const router = express.Router();
const passport = require('passport');
const Pusher = require('pusher');
const moment = require('moment');
const formidable = require('formidable');
const mv = require('mv');
const path = require('path');
const fs = require('fs');

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
  let user = '';

  if (req.query.approved_by_manager)
    query.approved_by_manager = req.query.approved_by_manager;
  if (req.query.approved_by_spv)
    query.approved_by_spv = req.query.approved_by_spv;
  if (req.query.approved_by_engineer)
    query.approved_by_engineer = req.query.approved_by_engineer;
  if (req.query.done) query.done = req.query.done;
  if (req.query.rejected) query.rejected = req.query.rejected;
  if (req.query.division)
    query.division = {
      $regex: req.query.division,
      $options: 'i'
    };
  if (req.query.overdue) query.deadline = { $lte: new Date() };
  if (req.query.user) user = req.query.user;

  WorkingOrder.find(query)
    .populate({
      path: 'pic',
      populate: {
        path: 'division'
      }
    })
    .sort('-created_at')
    .populate('users', 'name')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .then(workingOrders => {
      let wo = workingOrders;

      if (user) {
        wo = workingOrders.filter(wo => {
          return wo.users.filter(userData => {
            return userData._id.toString() === user;
          });
        });
      }

      return res.json(wo);
    })
    .catch(err => {
      console.log('lolo');
      res.status(404).json(err);
    });
});

router.post(
  '/upload-report/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users', 'name')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(wo => {
        if (wo.report) {
          fs.unlink(path.join(__dirname, '../../reports/') + wo.report, err => {
            if (err) return res.status(400).json(err);
          });
        }
        new formidable.IncomingForm().parse(req, (err, fields, files) => {
          const name = req.params.id + path.extname(files.filepond.name);
          const oldpath = files.filepond.path;
          const newpath = path.join(__dirname, '../../reports/') + name;

          mv(oldpath, newpath, err => {
            if (err) {
              return res.status(400).json(err);
            }
            wo.report = name;
            wo.save();

            pusher.trigger('ophar-app', 'upload-report-wo', wo);
            return res.end('Report uploaded successfully');
          });
        });
      })
      .catch(err => res.status(400).json(err));
  }
);

router.get(
  '/download-report/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .then(wo => {
        const file = path.join(__dirname, '../../reports/') + wo.report;
        res.download(file);
      })
      .catch(err => res.status(400).json(err));
  }
);

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
                const today = new Date();
                const startOfToday = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );
                WorkingOrder.find({
                  created_at: { $gte: startOfToday },
                  division: pic.division.name
                })
                  .then(wo => {
                    let division_initial = '';

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

                    switch (pic.division.name) {
                      case 'Corrective Maintenance':
                        division_initial = 'CM';
                        break;
                      case 'Preventive Maintenance':
                        division_initial = 'PM';
                        break;
                      case 'Assets':
                        division_initial = 'AS';
                        break;
                      case 'Patrols and Controls':
                        division_initial = 'PC';
                        break;
                      default:
                        division_initial = '';
                        break;
                    }

                    const now = moment().format('YYYYMMDD');
                    const id = wo.length + 1;

                    newWorkingOrder.wo_id = `${division_initial}${now}${id}`;

                    if (req.body.plans) {
                      newWorkingOrder.plans_string = req.body.plans;
                      const plans = req.body.plans.split('\n');

                      plans.map(plan => {
                        newWorkingOrder.plans.push({
                          name: plan,
                          // name: plan.value,
                          done: false
                        });
                      });
                    }

                    if (req.body.users) {
                      req.body.users.map(user => {
                        newWorkingOrder.users.push(user.value);
                      });
                    }

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
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  WorkingOrder.findById(req.params.id)
    .populate('pic')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .populate('users', 'name')
    .populate({
      path: 'notes.user',
      populate: {
        path: 'role'
      }
    })
    .then(workingOrder => {
      const woCustom = {
        _id: workingOrder._id,
        title: workingOrder.title,
        description: workingOrder.description,
        division: workingOrder.division,
        type: workingOrder.type.name,
        priority: workingOrder.priority.name,
        plans: workingOrder.plans,
        plans_string: workingOrder.plans_string,
        users: workingOrder.users,
        program: workingOrder.program,
        notes: workingOrder.notes,
        approved_by_spv: workingOrder.approved_by_spv,
        approved_by_manager: workingOrder.approved_by_manager,
        approved_by_engineer: workingOrder.approved_by_engineer,
        rejected: workingOrder.rejected,
        rejected_by_engineer: workingOrder.rejected_by_engineer,
        done: workingOrder.done,
        start: workingOrder.start,
        deadline: workingOrder.deadline,
        end: workingOrder.end,
        report: workingOrder.report,
        created_at: workingOrder.created_at,
        pic_id: workingOrder.pic._id,
        pic_name: workingOrder.pic.name,
        pic_email: workingOrder.pic.email,
        pic_avatar: workingOrder.pic.avatar
      };

      const notes = woCustom.notes;
      notes.sort((a, b) => {
        return b.created_at - a.created_at;
      });

      woCustom.notes = notes;

      return res.json(woCustom);
    })
    .catch(err => res.status(404).json(err));
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(workingOrder => {
        if (req.body._id) {
          delete req.body._id;
        }
        if (req.body.plans) {
          const fs = workingOrder.users.filter(
            user => user._id === req.user_id
          );
          if (!fs) {
            return res.status(403).json({
              message: "Sorry, you don't have permission in this work order."
            });
          }
          req.body.plans.map((plan, id) => {
            workingOrder.plans[id].done = plan.done;
          });
          delete req.body.plans;
        }
        if (req.body.plan) {
          workingOrder.plans.push({
            name: req.body.plan,
            done: false
          });
          delete req.body.plan;
        }
        for (let i in req.body) {
          workingOrder[i] = req.body[i];
        }
        workingOrder
          .save()
          .then(updatedWorkingOrder => {
            const notes = updatedWorkingOrder.notes;
            notes.sort((a, b) => {
              return b.created_at - a.created_at;
            });

            updatedWorkingOrder.notes = notes;
            pusher.trigger('ophar-app', 'update-wo', updatedWorkingOrder);
            return res.json(updatedWorkingOrder);
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  '/add-note/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    WorkingOrder.findById(req.params.id)
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(workingOrder => {
        User.findById(req.user._id)
          .populate('role')
          .then(user => {
            workingOrder.notes.push({
              user: user,
              message: req.body.note
            });
            workingOrder
              .save()
              .then(updatedWorkingOrder => {
                const notes = updatedWorkingOrder.notes;
                notes.sort((a, b) => {
                  return b.created_at - a.created_at;
                });

                updatedWorkingOrder.notes = notes;
                pusher.trigger('ophar-app', 'add-note-wo', updatedWorkingOrder);
                return res.json(updatedWorkingOrder);
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
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
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(workingOrder => {
        User.findById(req.user.id)
          .populate('role', 'name-_id')
          .then(user => {
            if (user.role.name === 'manager' && workingOrder.approved_by_spv) {
              workingOrder.approved_by_manager = !workingOrder.approved_by_manager;
              workingOrder.start = new Date();
            } else if (user.role.name === 'supervisor') {
              workingOrder.approved_by_spv = !workingOrder.approved_by_spv;
            } else if (
              workingOrder.pic._id.toString() === user._id.toString()
            ) {
              workingOrder.approved_by_engineer = !workingOrder.approved_by_engineer;
              workingOrder.end = new Date();
            } else {
              return res.status(403).json({
                message: "Sorry, you don't have permission in this work order"
              });
            }
            workingOrder
              .save()
              .then(newWorkingOrder => {
                const notes = newWorkingOrder.notes;
                notes.sort((a, b) => {
                  return b.created_at - a.created_at;
                });

                newWorkingOrder.notes = notes;
                pusher.trigger('ophar-app', 'approve-wo', newWorkingOrder);
                return res.status(200).json(newWorkingOrder);
              })
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
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(workingOrder => {
        User.findById(req.user.id)
          .populate('role', 'name-_id')
          .then(user => {
            if (
              user.role.name === 'manager' ||
              user.role.name === 'supervisor'
            ) {
              workingOrder.rejected = !workingOrder.rejected;
            } else if (
              user._id.toString() === workingOrder.pic._id.toString()
            ) {
              workingOrder.rejected_by_engineer = !workingOrder.rejected_by_engineer;
              if (workingOrder.done) {
                workingOrder.done = !workingOrder.done;
              }
            } else {
              return res.status(403).json({
                message: "Sorry, you don't have permission in this work order"
              });
            }
            workingOrder
              .save()
              .then(newWorkingOrder => {
                const notes = newWorkingOrder.notes;
                notes.sort((a, b) => {
                  return b.created_at - a.created_at;
                });

                newWorkingOrder.notes = notes;
                pusher.trigger('ophar-app', 'reject-wo', newWorkingOrder);
                return res.status(200).json(newWorkingOrder);
              })
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
      .populate('pic')
      .populate('type', 'name-_id')
      .populate('priority', 'name-_id')
      .populate('users')
      .populate({
        path: 'notes.user',
        populate: {
          path: 'role'
        }
      })
      .then(workingOrder => {
        User.findById(req.user.id)
          .then(user => {
            if (
              workingOrder.users.filter(user => {
                return user._id === user._id;
              }).length <= 0
            ) {
              return res.status(403).json({
                message: "Sorry, you don't have permission in this work order"
              });
            }

            if (
              !(
                workingOrder.approved_by_manager && workingOrder.approved_by_spv
              ) ||
              workingOrder.rejected
            ) {
              return res.status(400).json({
                message: 'Sorry, your work order is pending or already rejected'
              });
            }
            workingOrder.plans.map(plan => {
              plan.done = true;
            });
            workingOrder.done = !workingOrder.done;
            workingOrder
              .save()
              .then(newWorkingOrder => {
                const notes = newWorkingOrder.notes;
                notes.sort((a, b) => {
                  return b.created_at - a.created_at;
                });

                newWorkingOrder.notes = notes;
                pusher.trigger('ophar-app', 'done-wo', newWorkingOrder);
                return res.status(200).json(newWorkingOrder);
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
      .then(user => {
        WorkingOrder.findById(req.params.id)
          .populate('pic')
          .populate('type', 'name-_id')
          .populate('priority', 'name-_id')
          .populate('users')
          .populate({
            path: 'notes.user',
            populate: {
              path: 'role'
            }
          })
          .then(workingOrder => {
            if (user._id.toString() != workingOrder.pic._id.toString())
              return res.status(403).json({
                access:
                  'Sorry, you dont have access to delete this working order'
              });

            workingOrder.delete();
            workingOrder.save();
            pusher.trigger('ophar-app', 'delete-wo', workingOrder);
            return res.json(workingOrder);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
