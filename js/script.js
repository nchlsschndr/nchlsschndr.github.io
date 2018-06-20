$(document).ready(function() {
  // $('body').click(function() {
  //   $('.wrapper, .text, .one, .two').css( "animation-play-state", "running" );
  // });
  $('body').click(function(){
    // restart animation
    $('.wrapper, .text, .one, .two').css( "animation", "none" );
    setTimeout(function() {
        $('.wrapper, .text, .one, .two').css( "animation", "" );
    }, 10);
});
});
