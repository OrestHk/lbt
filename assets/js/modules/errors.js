var error = {
  // Methods
  specification: $(".errors .specification"),
  // Check if enought musics have been found to run the app
  musicLength: function(musics){
    if(musics.length < 1){
      this.display(10);
      return false;
    }
    else
      return true;
  },
  // Display a given error message
  display: function(error, optional){
    var message; // Error message
    // Reset specification class
    this.specification.removeAttr('class').addClass('specification');
    // Error message handler
    switch(error){
      // Custom error messages
      // No songs
      case 10 :
        message = 'Sorry but we didn\'t found any songs on your phone.';
      break;
      // All musics found
      case 20 :
        $(".errors .specification").addClass('error-20');
        message = 'Good job you recognize all your songs !';
      break;
    };
    // Append error message
    $(".errors .message").text(message);
    // Display error message
    display.slide('show', 'errors');
  },
};
