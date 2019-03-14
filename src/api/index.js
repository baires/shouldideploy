import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

import {
  getRandom,
  dayHelper,
  IS_FRIDAY,
} from '../js/constants';

let app = express ();

const router = express.Router();

app.get('/api', function(req, res) {
  res.status(200).send(
    {
      'shouldideploy': !IS_FRIDAY,
      'reason': getRandom(dayHelper()),
    }
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);