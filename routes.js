const express = require('express');
const { Message, Feelings } = require('./models');

function saveAndRespond(obj, res) {
  obj.save().then((saved) => {
    res.status(200).send({
      success: true,
      data: saved
    });
  }).catch((err) => {
    res.status(500).send({
      success: false,
      data: `${err}`
    });
  });
}

function apiOk(api) {
  return (req, res) => {
    res.status(200).send({
      success: true,
      data: `/${api} OK`
    });
  };
}

function routeMessages(app) {
  const router = express.Router();
  app.use('/message', router);

  router.get('/', apiOk('message'));

  router.post('/', (req, res) => {
    saveAndRespond(new Message(req.body), res);
  });

  return app;
}

function routeFeelings(app) {
  const router = express.Router();
  app.use('/feelings', router);

  router.get('/', apiOk('feelings'));

  router.post('/', (req, res) => {
    saveAndRespond(new Feelings(req.body), res);
  });

  return app;
}

function setupRoutes(app) {
  routeFeelings(routeMessages(app));
}

module.exports = { setupRoutes };
