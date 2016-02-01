var app = {
  // Methods
  // Launch app when device is ready
  init: function(){
    document.addEventListener('deviceready', this.ready, false);
  },
  // Launch directories listing
  ready: function(){
    var _this = app;
    // Check if scan already occured
    if(storage.getLocalStore())
      game.start();
    // Launch device scan
    else
      scan.listDirectories();
  }
};

// Initialize the app
app.init();
