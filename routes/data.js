var express = require('express');
var router = express.Router();
var tripCalculator = require('./data_fetcher/wind_time_calculator.js')

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body)
  console.log(tripCalculator('11 Broadway, New York', '350 5th Ave'))
  res.send('respond with a resource');
});

module.exports = router;
