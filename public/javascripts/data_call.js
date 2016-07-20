$(function() {
  clickListener()
})


var clickListener = function() {
  $('button').click(function(e){
    e.preventDefault()
    var startLocation = $('input#start').val()
    var finishLocation = $('input#finish').val()

    $.post( "/data", { start: startLocation, finish: finishLocation } );
  })
}
