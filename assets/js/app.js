var app = {
  // App parameters
  choices: 4, // Number of available answers
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
      console.log('Scan already occured');
    // Launch device scan
    else
      scan.listDirectories();
  }
};

// Initialize the app
app.init();
