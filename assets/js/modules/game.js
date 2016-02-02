var game = {
  // Game parameters
  nbChoices: 4, // Number of available answers
  choicesContainer: $(".game .choices"), // Choices container dom element
  scoreContainer: $(".game .score"),
  foundContainer: $(".game .found"),
  totalContainer: $(".game .total"),
  loadGame: $(".main-menu .load-game"),
  // Vars
  started: false, // Check if game started, no call to controls twice
  musics: [], // Game musics
  remain: [], // Remaining musics to find
  choices: [], // Current question choices
  score: 0, // Player score
  found: 0, // Musics found
  music: {}, // Current played music
  // Methods
  // Start game
  start: function(){
    // Enable controls if initial start
    if(!this.started)
      this.controls();
    // Game started
    this.started = true;
    // Check for existing game
    if(storage.game())
      this.loadGame.removeClass('btn-disabled');
    // Show main menu
    display.show(true, 'main-menu', false, true);
  },
  // Start a new game
  new: function(){
    // Reset game, if needed
    this.reset();
    // Set total music
    this.totalContainer.text(this.musics.length)
    // Give first question
    this.question(function(){
      display.show(true, 'game', false, true);
    });
  },
  // Load an existing game
  load: function(){
    // Get saved datas
    var data = storage.load();
    // Update score
    this.score = data.score;
    // Update found musics
    this.found = data.found;
    // Update remaining musics
    this.remain = data.remain;
    // Set total music
    this.totalContainer.text(this.musics.length)
    // Update score
    this.stats();
    // Give first question
    this.question(function(){
      display.show(true, 'game', false, true);
    });
  },
  // Display a question
  question: function(callback){
    // Remove previous questions
    this.choicesContainer.empty();
    // Stop music
    if(this.music.media)
      this.music.media.stop();
    // Reset music
    this.music = {};
    // Reset choices
    this.choices = [];
    // Check musics remain < game choices
    if(this.remain.length < this.nbChoices)
      this.nbChoices = this.remain.length;
    // Check if all musics have been found
    if(this.remain.length == 0){
      // Display all musics found message
      error.display(20);
      return false;
    }

    // Question vars
    var exclusion = []; // Songs to exclude (already in choices)
    var remain = this.remain.length - 1; // Length array remaining musics
    var btns = []; // Buttons html elements
    var i = 0; // Iteration var

    // Questions creation
    for(i; i < this.nbChoices; i++){
      // Get random integer
      var rand = this.getRand(0, remain, exclusion);
      // Get random music
      var music = this.remain[rand];
      // Push music in choices
      this.choices.push(music);
      // Exclude choosen music
      exclusion.push(rand);
      // Create button
      btns.push($("<button class='btn' name='"+music.name+"'>"+music.stripName+"</button>"));
    }

    // Shuffle choices and buttons
    btn = this.shuffle(btns);
    this.choices = this.shuffle(this.choices);

    // Append buttons
    var j = 0;
    var nbBtns = btns.length;
    for(j; j < nbBtns; j++) this.choicesContainer.append(btns[j]);

    // Play a music
    this.music.media = new Media(this.choices[0].localURL);
    this.music.data = this.choices[0];
    this.music.media.play();

    // Call callback if exist
    if(callback)
      callback();
  },
  // Check if answer is correct
  answer: function(el){
    // Get answer music name
    var name = el.attr('name');
    // Check if answer is correct
    if(name == this.music.data.name){
      // If correct add 1 point
      this.score++;
      // Add music found
      this.found++;
      // Remove the music from the remaining
      var i = 0; // Loop iteration
      var nbRemain = this.remain.length; // Number of remaining
      for(i; i < nbRemain; i++){
        // If current music is the one from the loop
        if(this.remain[i].id === this.music.data.id){
          // Remove it and break the loop
          this.remain.splice(i, 1);
          break;
        }
      }
      // Update storage
      storage.update(true);
    }
    // If reponse is incorrect
    else{
      // Remove 1 point
      this.score--;
      // If score is 0, keep it at 0
      if(this.score < 0)
        this.score = 0;
      // Update storage
      storage.update(false);
    }

    // Update score
    this.stats();

    // Launch next question
    this.question();
  },
  // Update user stats
  stats: function(){
    // Update score
    this.scoreContainer.text(this.score);
    // Update found
    this.foundContainer.text(this.found);
  },
  // Reset game, user score,...
  reset: function(){
    // Reset nbChoices
    this.nbChoices = 4;
    // Reset score
    this.score = 0;
    // Initiate musics
    this.musics = storage.musics.slice(0);
    this.remain = storage.musics.slice(0);
  },
  // Pause the game
  pause: function(){

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
    // Choose answer
    $(".game .choices").on('click', '.btn', function(){
      _this.answer($(this));
    });
  },
  // Get a random integer between min and max different of exclusion
  getRand: function(min, max, exclusion){
    // Get random integer between min and max
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    // Check if there is exclusions
    if(typeof exclusion !== 'undefined'){
      // Check if rand isn't exclude
      while(exclusion.indexOf(random) !== -1){
        random = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      return random;
    }
    else
      return random;
  },
  // Shuffle an array
  shuffle: function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while(0 !== currentIndex){
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
};
