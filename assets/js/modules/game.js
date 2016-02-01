var game = {
  // Game parameters
  choices: 4, // Number of available answers
  // Methods
  // Start game
  start: function(){
    // Enable controls
    this.controls();
    // Show main menu
    display.show(true, 'main-menu', false, true);
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
  },
  // Pause the game
  pause: function(){

  },
};
