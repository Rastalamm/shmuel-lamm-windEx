// use npm geocoder to find coordinates
var NodeGeocoder = require('node-geocoder');
var options = {provider: 'google'};
var geocoder = NodeGeocoder(options);
var geolib = require('geolib')
var Promise = require("bluebird");
var data = []

var formatData = function(num, res) {
  data[num] = {'coordinates': {}}
  data[num]['address'] = res[0].formattedAddress
  data[num]['coordinates']['latitude'] = res[0].latitude
  data[num]['coordinates']['longitude'] = res[0].longitude
}

var getCoordWithBluebird = (addresses) => {
  return new Promise(function(resolve, reject) {

    geocoder.geocode(addresses[0], function(err, res) {
      if (err) {reject(err)}
      else {
        formatData(0, res)
      }
    })
    geocoder.geocode(addresses[1], function(err, res) {
      if (err) {reject(err)}
      else {
        formatData(1, res)
        resolve(data)
      }
    })
  })
}

getCoordWithBluebird(['29 champs elysée paris', '350 5th avenue'])
.then(function(data) {
  data["midpoint"] = geolib.getCenter([
    data[0].coordinates,
    data[1].coordinates
  ]);
  console.log(data)
})
