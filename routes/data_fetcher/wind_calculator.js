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

var runWindCalculator = (start, finish) => {
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
    console.log(data)
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
  data['adjustedTravel']['non-adjustedSpeed'] = round(assumedSpeed)
  data['adjustedTravel']['adjustedTime'] = round(adjustedTime)
  data['adjustedTravel']['adjustedSpeed'] = round(adjustedSpeed)
  return data
}

var round = (input) => {
  return Math.ceil(input * 100) / 100
}

runWindCalculator('11 Broadway, New York', '350 5th Ave')
