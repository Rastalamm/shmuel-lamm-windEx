var Promise = require("bluebird")
var geoData = require('./geocoder.js')
var weatherData = require('./weather.js')
var distanceData = require('./google_distance.js')
var data = {}

var combineData = (start, finish) => {
  return new Promise(function(resolve, reject) {

    geoData(start, finish, function(error, result) {
      if (error) {reject(error)}
      else {
        // console.log(result)
        data["geoData"] = result
        resolve(data)
      }
    })
  })
}

var runCombineData = (start, finish, fn) =>{
  combineData(start, finish)

  .then((data) => {
    let startCoord = data.geoData[0].coordinates
    let finishCoord = data.geoData[1].coordinates

    distanceData(startCoord, finishCoord, (body) => {
      data["distanceData"] = body
      let lat = data.geoData.midpoint.lat
      let lon = data.geoData.midpoint.lon

      weatherData([lat, lon], (body) => {
        data["windData"] = body
        fn(null, data)
      })
    })
  })
  .catch(function(error) {
    console.log('Combine Data error with bluebird: ' + error)
  })
}

module.exports = runCombineData
// runCombineData('11 Broadway, New York', '350 5th Ave')
// calling the function as above give the return:
// { geoData:
//    [ { coordinates: [Object],
//        address: '11 Broadway, New York, NY 10004, USA' },
//      { coordinates: [Object],
//        address: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA' },
//      bearing: -153.5303246257672,
//      midpoint: LatLon { lat: 40.726861018183236, lon: -73.99984474975099 } ],
//   distanceData:
//    { distance: 7176,
//      distanceInWords: '4.5 mi',
//      duration: 1682,
//      durationInWords: '28 mins' },
//   windData: [ windHeading: 360, windSpeedMPH: 9.17 ] }
