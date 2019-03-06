const express = require('express');
const router = express.Router();
const passport = require('passport');

const validateToolsAssetInput = require('../../validations/tools-asset');

const ToolsAsset = require('../../models/ToolsAsset');
const User = require('../../models/User');

router.get('/', (req, res) => {
  let query = {};

  if (req.query.division)
    query.division = {
      $regex: req.query.division,
      $options: 'i'
    };

  ToolsAsset.find(query)
    .populate({
      path: 'pic',
      populate: {
        path: 'division'
      }
    })
    .then(ToolsAssets => res.json(ToolsAssets))
    .catch(err => res.status(404).json(err));
});

router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateToolsAssetInput(req.body);

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
      })
      .catch(err => res.status(404).json(err));
  }
);

router.get('/:id', (req, res) => {
  ToolsAsset.findById(req.params.id)
    .populate('pic')
    .populate('type', 'name-_id')
    .populate('priority', 'name-_id')
    .then(ToolsAsset => res.json(ToolsAsset))
    .catch(err => res.status(404).json(err));
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ToolsAsset.findById(req.params.id)
      .then(ToolsAsset => {
        if (req.body._id) {
          delete req.body._id;
        }
        for (let i in req.body) {
          ToolsAsset[i] = req.body[i];
        }
        ToolsAsset.save()
          .then(updatedToolsAsset => {
            res.json(updatedToolsAsset);
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  '/tools/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    ToolsAsset.findById(req.params.id).catch(err => res.status(404).json(err));
  }
);

router.post(
  '/done/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    ToolsAsset.findById(req.params.id)
      .populate('pic', 'division-_id')
      .then(ToolsAsset => {
        User.findById(req.user.id)
          .then(pic => {
            if (pic.division.email !== ToolsAsset.pic.division.email) {
              return res.status(403).json({
                message: 'Maaf, anda bukan PIC untuk halaman ini'
              });
            }
            ToolsAsset.save()
              .then(newToolsAsset => res.status(200).json(newToolsAsset))
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
