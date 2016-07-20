$(function() {
  clickListener()
})


var clickListener = function() {
  $('button').click(function(e){
    e.preventDefault()
    var startLocation = $('input#start').val()
    var finishLocation = $('input#finish').val()

    var sendData = $.post( "/data", { start: startLocation, finish: finishLocation } );
    sendData.done(function(data){
      var startAddress = data.geoData[0].address
      appendToPage(startAddress, "startAddress")

      var finishAddress = data.geoData[1].address
      appendToPage(finishAddress, "finishAddress")

      var tripBearing = Math.ceil((data.geoData[2].bearingForRadians + 180) * 100) / 100
      appendToPage(tripBearing, 'tripBearing')

      var distanceInWords = data.distanceData.distanceInWords
      appendToPage(distanceInWords, 'distanceInWords')

      var durationInWords = data.distanceData.durationInWords
      appendToPage(durationInWords, 'durationInWords')

      var windHeading = data.windData.windHeading
      appendToPage(windHeading, 'windHeading')

      var windSpeedMPH = data.windData.windSpeedMPH
      appendToPage(windSpeedMPH, 'windSpeedMPH')

      var headwind = data.windComponents.headwind
      if (parseInt(headwind) >= 0) {
        headwind += " mph headwind"
      } else {
        headwind = (Math.abs(headwind) + " mph tailwind")
      }
      appendToPage(headwind, 'headwind')

      var crosswind = (Math.abs(data.windComponents.crosswind) + " mph")
      appendToPage(crosswind, 'crosswind')

      var nonAdjustedSpeed = (data.adjustedTravel['non-adjustedSpeed'] + " mph")
      appendToPage(nonAdjustedSpeed, 'nonAdjustedSpeed')

      var adjustedTime = data.adjustedTravel.adjustedTime
      appendToPage(adjustedTime , 'adjustedTime ')

      var adjustedSpeed = (data.adjustedTravel.adjustedSpeed + ' mph')
      appendToPage(adjustedSpeed, 'adjustedSpeed')

      var adjustedDurationInWords = data.adjustedTravel.durationInWords
      appendToPage(adjustedDurationInWords, 'adjustedDurationInWords')

      dataElements = document.querySelectorAll(".trip-data");
      for (var i = 0; i < dataElements.length; i++) {
        dataElements[i].style.visibility = 'visible';
      }
    })
  })
}

var appendToPage = function(data, id) {
  var setId = '#' + id
  $(setId).html(data)
}
