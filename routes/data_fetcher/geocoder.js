// use npm geocoder to find coordinates
var NodeGeocoder = require('node-geocoder');
var options = {provider: 'google'};
var geocoder = NodeGeocoder(options);

// use npm geolib to find coordinate midpoints
var geoLib = require('geolib')

// input address. output address and x/y coordinates
function findCoordinates(address) { geocoder.geocode(address)
  .then(function(res) {
    let data = {'coordinates': []}
    data['address'] = res[0].formattedAddress
    data['coordinates']['latitude'] = res[0].latitude
    data['coordinates']['longitude'] = res[0].longitude
    console.log(data);
    return data
  })
  .catch(function(err) {
    console.log(err);
    return err
  });
}

// place this in the runner and substitute input with form params
findCoordinates('29 champs elysée paris')
findCoordinates('350 Fifth Avenue')
