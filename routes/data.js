var express = require('express');
var router = express.Router();
var Promise = require("bluebird")
var tripCalculator = require('./data_fetcher/wind_time_calculator.js')
var util = require('util')
/* GET users listing. */
router.post('/', function(req, res, next) {
  let locations = req.body
  console.log(locations)
  runSendApiData(locations.start, locations.finish)
  // console.log(tripCalculator('11 Broadway, New York', '350 5th Ave'))
  // res.send('respond with a resource');
});

var sendApiDAta = (startAddress, finishAddress) => {
  return new Promise(function(resolve, reject) {
    tripCalculator(startAddress, finishAddress, function(error, result) {
      if (error) {reject(error)}
      else {
        resolve(result)
      }
    })
  })
}

var runSendApiData = (startAddress, finishAddress) => {
  sendApiDAta(startAddress, finishAddress)

  .then((data) => {
    console.log(data)
    res.send(data);
  })

  .catch(function(error) {
    console.log('Data.js router error with bluebird: ' + error)
  })
}

module.exports = router;
