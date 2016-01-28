var error = {
  // Methods
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
    // Error message handler
    switch(error){
      // Custom error messages
      // No songs
      case 10 :
        message = 'Sorry but we didn\'t found any songs on your phone.';
      break;
    };
  },
};
