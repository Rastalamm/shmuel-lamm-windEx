var apiData = require('./combine_api_data.js')
var Promise = require("bluebird")

var calculateWind = (start, finish) => {
  return new Promise(function(resolve, reject) {

    apiData(start, finish, function(error, result) {
      if (error) {reject(error)}
      else {
        resolve(result)
      }
    })
  })
}

var runWindCalculator = (start, finish, fn) => {
  calculateWind(start, finish)

  .then((data) => {
    let windSpeed = data.windData.windSpeedMPH
    let windHeading = data.windData.windHeading
    let tripBearing = data.geoData.bearingForRadians
    data['windComponents'] = {}
    return headAndCrossWinds(windSpeed, windHeading, tripBearing, data)
  })

  .then((data) => {
    let travelDistanceMiles = (data.distanceData.distance / 1609.34)
    let travelTimeHours = (data.distanceData.duration / 60 / 60)
    let headwindMPH = data.windComponents.headwind
    data['adjustedTravel'] = {}
    return adjustedTravelTime(travelDistanceMiles, travelTimeHours, headwindMPH, data)

  })

  .then((data) => {
    fn(null, data)
  })

  .catch(function(error) {
    console.log('Wind and Time Calculator error with bluebird: ' + error)
  })
}

var headAndCrossWinds = (windSpeed, windHeading, tripBearing, data) => {
  calculateHeadwind(windSpeed, windHeading, tripBearing, data)
  return calculateCrosswind(windSpeed, windHeading, tripBearing, data)
}

var calculateHeadwind = (windSpeed, windHeading, tripBearing, data) => {
  let headwind = windSpeed * Math.cos((tripBearing - windHeading) * Math.PI / 180)*-1
  data['windComponents']['headwind'] = round(headwind)
}

var calculateCrosswind = (windSpeed, windHeading, tripBearing, data) => {
  let crosswind = windSpeed * Math.sin((tripBearing - windHeading) * Math.PI / 180)*-1
  data['windComponents']['crosswind'] = round(crosswind)
  return data
}

var adjustedTravelTime = (travelDistanceMiles, travelTimeHours, headwindMPH, data) => {
  let assumedSpeed = (travelDistanceMiles / travelTimeHours)
  let adjustedSpeed = assumedSpeed - (headwindMPH * 0.37)
  let adjustedTime = travelDistanceMiles / adjustedSpeed
  let durationInWords = minutesToString(round(adjustedTime) * 60)
  data['adjustedTravel']['non-adjustedSpeed'] = round(assumedSpeed)
  data['adjustedTravel']['adjustedTime'] = round(adjustedTime)
  data['adjustedTravel']['adjustedSpeed'] = round(adjustedSpeed)
  data['adjustedTravel']['durationInWords'] = durationInWords
  return data
}

var round = (input) => {
  return Math.ceil(input * 100) / 100
}

var minutesToString = (totalMinutes) => {
  let minutes = totalMinutes % 60
  let hours = (totalMinutes - minutes)/60
  if (hours > 0) {
    var formattedTime = `${hours} hour${ending(hours)} and ${round(minutes)} minute${ending(minutes)}`
  } else {
    var formattedTime = `${round(minutes)} minute${ending(minutes)}`
  }
  return formattedTime
}

var ending = (number) => {
  return (number > 1 || number == 0) ? 's' : '';
}

module.exports = runWindCalculator
// runWindCalculator('11 Broadway, New York', '350 5th Ave')
// // result from running the above function call should be something like:
// { geoData:
//    [ { coordinates: [Object],
//        address: '11 Broadway, New York, NY 10004, USA' },
//      { coordinates: [Object],
//        address: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA' },
//      bearingForRadians: -153.5303246257672,
//      midpoint: LatLon { lat: 40.726861018183236, lon: -73.99984474975099 } ],
//   distanceData:
//    { distance: 7176,
//      distanceInWords: '4.5 mi',
//      duration: 1682,
//      durationInWords: '28 mins' },
//   windData: [ windHeading: 30, windSpeedMPH: 9.17 ],
//   windComponents: { headwind: 9.16, crosswind: -0.56 },
//   adjustedTravel:
//    { 'non-adjustedSpeed': 9.55,
//      adjustedTime: 0.73,
//      adjustedSpeed: 6.16,
//      durationInWords: '43.8 minutes' } }
