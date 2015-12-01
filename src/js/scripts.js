(function(){
  new WOW().init();

  function ScrollToLink(link){
    var $href = $(link).attr('href');
    var $anchor = $($href).offset();
    $('html, body').animate({ scrollTop: $anchor.top });
    return false;
  }

  $('nav ul').find('a').click(function(){
      return ScrollToLink(this);
  });

  $('header').find('a').click(function(){
      return ScrollToLink(this);
  });

  $('footer').find('a').click(function(){
      return ScrollToLink(this);
  });

  $('nav h1').find('a').click(function(){
      $('html, body').animate({ scrollTop: 0 });
      return false;
  });

  $( document ).ready(function() {
    $('.input').on('input propertychange paste', function() {
      if ($(this).val()) {
        $(this).prev().addClass('show-label');
        $(this).prev().removeClass('hide-label');
      } else {
        $(this).prev().removeClass('show-label');
        $(this).prev().addClass('hide-label');
      }
    });

    // adjusts header height
      $('header').css("height", window.innerHeight);
      $('.cinemagraph').css('height', window.innerHeight);
      var newHeaderContentHeight = (window.innerHeight / 2) - ($('.header-content').height()/2); // 50%
      newHeaderContentHeight -= $('.logo').height();
      newHeaderContentHeight = newHeaderContentHeight < 0 ? 0 : newHeaderContentHeight;
      $('.header-content').css("top", newHeaderContentHeight);
  });


  var isVisible = function(elem) {
    var elemTop = $(elem).offset().top;
    var elemHeight = $(elem).height();
    var sclTop = $(window).scrollTop();
    var newTop = elemTop - sclTop;
    if ((newTop < 1) && (newTop > (-1*elemHeight))) {
      return true;
    } else {
      return false;
    }
  };

  $(window).on('scroll', function ( e ) {
    if ($(window).scrollTop() > window.innerHeight - 150) {
      $('nav').removeClass('clear-nav');
    } else {
      $('nav').addClass('clear-nav');
    };

    if(isVisible('#contact')) {
      $('a[href="#contact"]').addClass('active');
    } else {
      $('a[href="#contact"]').removeClass('active');
    }
  });
})();
