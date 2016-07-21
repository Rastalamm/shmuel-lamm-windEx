var express = require('express');
var router = express.Router();
var Promise = require("bluebird")
var tripCalculator = require('./data_fetcher/wind_time_calculator.js')
var util = require('util')


router.post('/', function(req, res, next) {
  let locations = req.body
  runSendApiData(locations.start, locations.finish, res)
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

var runSendApiData = (startAddress, finishAddress, res) => {
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
