var error = {
  // Methods
  specifications: $(".errors .specification"),
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
    this.specifications.removeClass('show');
    // Error message handler
    switch(error){
      // Custom error messages
      // No songs
      case 10 :
        $(".errors .error-10").addClass('show');
        message = 'Sorry but we didn\'t found any songs on your phone.';
      break;
      // All musics found
      case 20 :
        $(".errors .error-20").addClass('show');
        message = 'Good job you recognize all your songs !';
      break;
      // After refresh message
      case 30 :
        $(".errors .error-30").addClass('show');
        message = 'Refresh completed successfully !';
      break;
    };
    // Append error message
    $(".errors .message").text(message);
    // Display error message
    display.slide('show', 'errors');
  },
};
