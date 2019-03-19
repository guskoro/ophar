const express = require('express');
const router = express.Router();
const passport = require('passport');
const Pusher = require('pusher');

const validateUploadScada20kvInput = require('../../validations/upload-scada20kv');

const UploadScada20kv = require('../../models/UploadScada20kv');
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

  UploadScada20kv.find(query)
    .populate({
      path: 'pic',
      populate: {
        path: 'division'
      }
    })
    .populate('type', 'name-_id')
    .then(uploadScada20kvs => res.json(uploadScada20kvs))
    .catch(err => res.status(404).json(err));
});

router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateUploadScada20kvInput(req.body);

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
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  uploadScada20kv
    .findById(req.params.id)
    .populate('pic')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .then(uploadScada20kv => {
      const usCustom = {
        _id: uploadScada20kv._id,
        arid: uploadScada20kv.arid,
        iid: uploadScada20kv.iid,
        region: uploadScada20kv.region,
        description: uploadScada20kv.description,
        classification: uploadScada20kv.classification,
        rootcause: uploadScada20kv.rootcause,
        rootdetail: uploadScada20kv.rootdetail,
        impact: uploadScada20kv.impact,
        type: uploadScada20kv.type,
        start: uploadScada20kv.start,
        end: uploadScada20kv.end,
        arrequest: uploadScada20kv.arrequest,
        ardestination: uploadScada20kv.ardestination,
        arregion: uploadScada20kv.arregion,
        arcreate: uploadScada20kv.arcreate,
        arclose: uploadScada20kv.arclose,
        arend: uploadScada20kv.arend,
        recduration: uploadScada20kv.recduration,
        ttr: uploadScada20kv.ttr,
        kronologi: uploadScada20kv.kronologi,
        improve: uploadScada20kv.improve,
        saidi: uploadScada20kv.saidi,
        month: uploadScada20kv.month,
        week: uploadScada20kv.wee
      };

      return res.json(usCustom);
    })
    .catch(err => res.status(404).json(err));
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    UploadScada20kv.findById(req.params.id)
      .then(uploadScada20kv => {
        if (req.body._id) {
          delete req.body._id;
        }
        for (let i in req.body) {
          uploadScada20kv[i] = req.body[i];
        }
        uploadScada20kv
          .save()
          .then(updatedUploadScada20kv => {
            pusher.trigger('ophar-app', 'update-us', newUploadScada20kv);
            return res.json(updatedUploadScada20kv);
          })
          .catch(err => res.status(400).json(err));
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
    UploadScada20kv.findById(req.params.id)
      .populate('pic')
      .populate('type', 'name-_id')
      .then(uploadScada20kv => {
        User.findById(req.user.id)
          .then(pic => {
            if (pic.division.email !== uploadScada20kv.pic.division.email) {
              return res.status(403).json({
                message: 'Maaf, anda bukan PIC untuk working order ini'
              });
            }
            return res.status(400).json({
              message:
                'Maaf, working order anda belum di-approve atau telah di-reject'
            });
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
        UploadScada20kv.findById(req.params.id)
          .then(uploadScada20kv => {
            if (user.division.name != uploadScada20kv.division)
              return res.status(403).json({
                access:
                  'Sorry, you dont have access to delete this working order'
              });

            uploadScada20kv.delete();
            uploadScada20kv.save();
            pusher.trigger('ophar-app', 'delete-us', uploadScada20kv);
            return res.json(uploadScada20kv);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
