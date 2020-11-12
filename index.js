require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const logger = require('./utils/logger');

const { setupRoutes } = require('./routes');

const PORT = process.env.PORT || 5005;
const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  logger.info('Connected to database...');
});

const corsOptions = {
  origin: [ process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(helmet());

app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    data: 'API OK'
  });
});

setupRoutes(app);

let server = app.listen(PORT, () => {
  logger.info(`Listening @ ${PORT}`);
});

module.exports = server;
