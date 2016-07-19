var Promise = require("bluebird")
const request = require('request')
var util = require('util')
var keys = require('../../keys.js')

var createUrl = (startCoord, finishCoord) => {
  let baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial'
  let formatStart = '&origins=' + startCoord.join(",")
  let formatFinish = '&destinations=' + finishCoord.join(",")
  let transMode = '&mode=bicycling'
  let apiKey = '&key=' + keys.googleDistanceApiKey
  return baseUrl + formatStart + formatFinish + transMode + apiKey
}

var formatReturnData = (body) => {
  let parser = JSON.parse(body)
  let parsedBody = parser.rows[0].elements[0]
  let matrixData = {}
  //distance is in meters
  matrixData['distance'] = parsedBody.distance.value
  matrixData['distanceInWords'] =parsedBody.distance.text
  // time in seconds
  matrixData['duration'] = parsedBody.duration.value
  matrixData['durationInWords'] = parsedBody.duration.text
  return matrixData
}


var getDistWithBluebird = (startCoord, finishCoord) => {
  return new Promise(function(resolve, reject) {
    let url = createUrl(startCoord, finishCoord)

    request(url, (err, resp, body) => {
      if (err) {reject(err)}
      else {
        resolve(body)
      }
    });
  })
}

var runGoogleDistance = (startCoord, finishCoord) => {
  getDistWithBluebird(startCoord, finishCoord)
  .then(function(body) {
    let matrixData = formatReturnData(body)
    console.log(matrixData)
  })
  .catch(function(error) {
    console.log('Google Distance Matrix error through bluebird: ' + error)
  })
}

runGoogleDistance([ 40.7052799, -74.0140249 ], [ 40.7484404, -73.9856554 ])
