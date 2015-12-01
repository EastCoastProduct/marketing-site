(function(){
  // list of images to load
  var headerImage = [{member:'cinemagraph', gif:'assets/header2.gif'}];

  var listOfImages = [
    [
      {member:'team01', gif:'assets/team/chris.gif'},
      {member:'team04', gif:'assets/team/petar.gif'}
    ],
    {member:'team02', gif:'assets/team/steve.gif'},
    {member:'team03', gif:'assets/team/ivan.gif'},
    {member:'team05', gif:'assets/team/niksa.gif'}
  ];

  function loopChangeGif(team) {
    for(var i in team) {
      changeToGif(team[i].member);
    }
  }

  function changeToGif(member) {
    member = '.' + member;
    var img = $(member).css('background-image');
    $(member).css('background-image', img.replace('.jpg', '.gif'));
  }

  function loadPicturesSync(pictureUrls, callback) {
    var length = pictureUrls.length;
    var loaded = 0;

    for(var i in pictureUrls) {
      (function(img, src) {
        img.onload = function() {
          if (++loaded == length && callback) {
            callback(pictureUrls);
          }
        };
        img.onerror = function() {};
        img.onabort = function() {};
        img.src = src;
      } (new Image(), pictureUrls[i].gif));
    }
  }

  var loadPictures = function(pictureUrls) {
    for(var i in pictureUrls) {
      if(pictureUrls[i].length) {
        loadPicturesSync(pictureUrls[i], loopChangeGif);
      } else {
        (function(img, src) {
          img.onload = function(member) {
            return function() {
              changeToGif(member);
            };
          } (pictureUrls[i].member);
          img.onerror = function() {};
          img.onabort = function() {};
          img.src = src;
        } (new Image(), pictureUrls[i].gif));
      }
    }
  };

  $(window).load(function(){
    $("#preload-wrapper").css("display", "none");
    loadPictures(headerImage);
    // loadPictures(listOfImages);
  });
})();
