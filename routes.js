const express = require('express');
const { createTransport } = require('nodemailer');
const { Message, Feelings } = require('./models');
const logger = require('./utils/logger');

const POST_FUNCTION = {
  message: sendEmail,
  feelings: saveFeelings
}

function saveAndRespond(obj, res) {
  obj.save().then((saved) => {
    res.status(200).send({
      success: true,
      data: `${saved}`
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

function route(app, endpoint) {
  const router = express.Router();

  app.use(`/${endpoint}`, router);
  router.get('/', apiOk(endpoint));
  router.post('/', POST_FUNCTION[endpoint]);
}

function saveFeelings(req, res) {
  saveAndRespond(new Feelings(req.body), res);
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

function setupRoutes(app) {
  Object.keys(POST_FUNCTION).forEach(e => route(app, e));
}

module.exports = { setupRoutes };
