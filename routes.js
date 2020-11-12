const express = require('express');
const { createTransport } = require('nodemailer');
const { Message, Feelings } = require('./models');
const logger = require('./utils/logger');

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
  router.post('/', sendEmail);

  return app;
}

function sendEmail(req, res) {
  const smtpTransport = createTransport({
    host: 'mail.smtp2go.com',
    port: process.env.E_PRT,
    auth: {
      user: process.env.E_USR,
      pass: process.env.E_PSW
    }
  });

  const mailOptions = {
    from: `${process.env.E_USR}@smtp2go.com`,
    to: process.env.E_REC,
    replyTo: `${req.body.email}`,
    subject: '[THE-HAPPY-APP] contact',
    text: `${req.body.message}`
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if(error) logger.error(error);
    saveAndRespond(new Message(req.body), res);
  });
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
