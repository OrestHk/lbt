var game = {
  // Game parameters
  started: false, // Check if game started, no call to controls twice
  choices: 4, // Number of available answers
  musics: [], // Game musics
  found: [], // Found musics
  // Methods
  // Start game
  start: function(){
    // Enable controls if initial start
    if(!this.started)
      this.controls();
    // Game started
    this.started = true;
    // Show main menu
    display.show(true, 'main-menu', false, true);
  },
  // Start a new game
  new: function(){
    this.question(function(){
      display.show(true, 'game', false, true);
    });
  },
  // Load an existing game
  load: function(){

  },
  // Display a question
  question: function(){

  },
  // Initialize game controls
  controls: function(){
    var _this = this;
    // Open options menu
    $(".options-game").click(function(){
      display.slide('show', 'options');
    });
    // Close options menu
    $(".options .close").click(function(){
      display.slide('hide', 'options');
    });
    // Return to menu
    $(".options .return-menu").click(function(){
      // Pause game
      _this.pause();
      // Show main menu
      display.show(true, 'main-menu', false, true);
      // Hide overlays
      display.slide('hide');
    });
    // Refresh musics list
    $(".options .refresh-music").click(function(){
      // Show main menu
      display.show(true, 'loader', function(){
        scan.listDirectories(function(){
          console.log('Musics refreshed');
        });
      }, true);
      // Hide overlays
      display.slide('hide');
    });
    // Start a new game
    $(".new-game").click(function(){
      _this.new();
    });
    // Load an existing game
    $(".load-game").click(function(){
      // If a game is available, load it
      if(!$(this).hasClass('btn-disabled'))
        _this.load();
    });
  },
  // Pause the game
  pause: function(){

  },
};
