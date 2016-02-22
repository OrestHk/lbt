var app = {
  // Methods
  // Launch app when device is ready
  init: function(){
    document.addEventListener('deviceready', this.ready, false);
  },
  // Launch directories listing
  ready: function(){
    var _this = app;
    // App focus out handler
    document.addEventListener('pause', _this.pause, false);
    // App focus back handler
    document.addEventListener('resume', _this.resume, false);
    // Init cordova diagnostic
    perm.diagnostic = cordova.plugins.diagnostic;
    // Exit app handler
    $(".errors .exit").click(function(){
      navigator.app.exitApp();
    });
    // Check if scan already occured
    if(storage.getLocalStore())
      game.start();
    // Launch device scan
    else
      scan.listDirectories();
  },
  // App focus out
  pause: function(){
    // Pause music
    if(game.music.media)
      game.music.media.pause();
  },
  // App focus back
  resume: function(){
    // Continue music
    if(game.music.media && !game.paused)
      game.music.media.play();
  }
};

// Initialize the app
app.init();
