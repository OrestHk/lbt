var game = {
  // Game parameters
  nbChoices: 4, // Number of available answers
  choicesContainer: $(".game .choices"), // Choices container dom element
  scoreContainer: $(".game .score"),
  foundContainer: $(".game .found"),
  totalContainer: $(".game .total"),
  loadGame: $(".main-menu .load-game"),
  // Vars
  refreshed: false, // Check if musics have been refreshed
  started: false, // Check if game started, no call to controls twice
  paused: false, // Check if game is paused
  inGame: false, // Check if user is in game
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
    // User is in game
    this.inGame = true;
    if(!this.refreshed)
      // Reset game, if needed
      this.reset(true);
    // Update datas with new musics
    else
      this.refresh();
    // Set total music
    this.totalContainer.text(this.musics.length)
    // Give first question
    this.question(function(){
      display.show(true, 'game', false, true);
    });
  },
  // Load an existing game
  load: function(){
    // User is in game
    this.inGame = true;
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
  // Continue game after finding all musics
  continue: function(){
    // Reset game (not score)
    if(!this.refreshed)
      this.reset(false);
    // Update datas with new musics
    else
      this.refresh();
    // Give first question
    this.question(function(){
      display.show(true, 'game', function(){
        // Hide overlays (if necessary)
        display.slide('hide');
      }, true);
    });
  },
  // Display a question
  question: function(callback){
    // Remove previous questions
    this.choicesContainer.empty();
    // Stop music
    if(this.music.media)
      this.music.media.stop();
    // Reset pause
    this.paused = false;
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
    var exclusion = []; // Musics to exclude (already in choices)
    var remain = this.remain.length - 1; // Length array remaining musics
    var btns = []; // Buttons html elements
    var i = 0; // Iteration var

    // Questions creation
    for(i; i < this.nbChoices; i++){
      // Get random integer
      var rand = this.rand(0, remain, exclusion);
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
      // Allow load game
      if(this.loadGame.hasClass('btn-disabled'))
        this.loadGame.removeClass('btn-disabled');
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
  reset: function(hard){
    // If hard reset, reset score
    if(hard)
      this.score = 0;
    // Reset nbChoices
    this.nbChoices = 4;
    // Reset found
    this.found = 0;
    // Initiate musics
    this.musics = storage.musics.slice(0);
    this.remain = storage.musics.slice(0);
    // Update storage
    storage.update(true);
    // Update user stats
    this.stats();
  },
  // Refresh user stats after music list refresh
  refresh: function(){
    // Get previous found musics
    var found = this._found();
    // Reset game (not score)
    this.reset();
    // Check if musics have been found in the new list
    var i = 0; // Iteration var
    var nbFound = found.length; // Number of previous musics found
    // Check if previously found music still exist after new scan
    for(i; i < nbFound; i++){
      var j = 0; // Iteration var
      var nbMusics = this.remain.length; // Number of newly scanned musics
      for(j; j < nbMusics; j++){
        // Check if music has the same name
        if(found[i].name == this.remain[j].name){
          // Check if music has the same size
          if(found[i].size == this.remain[j].size){
            // Remove musics from remaining onces
            this.remain.splice(j, 1);
            // Break the loop
            break;
          }
        }
      }
    }
    // Update found
    this.found = this.musics.length - this.remain.length;
    // Update user stats
    this.stats();
    // Set total music
    this.totalContainer.text(this.musics.length);
    // Refresh musics
    // storage.localStore();
    // Reset refreshed
    this.refreshed = false;
  },
  // Pause the game
  pause: function(){
    this.paused = true;
    // Check if in game
    if(this.music.media)
      // Pause the game
      this.music.media.pause();
  },
  // Resume the game, if playing
  resume: function(){
    this.paused = false;
    // Check if in game
    if(this.music.media && this.inGame == true)
      // Pause the game
      this.music.media.play();
  },
  // Initialize game controls
  controls: function(){
    var _this = this;
    // Open options menu
    $(".options-game, .open-menu").click(function(){
      display.slide('show', 'options');
      // Pause game
      _this.pause();
    });
    // Close options menu
    $(".options .close").click(function(){
      display.slide('hide', 'options');
      // Resume game
      _this.resume();
    });
    // Return to menu
    $(".options .return-menu").click(function(){
      // User is in game
      _this.inGame = false;
      // Pause game
      _this.pause();
      // Show main menu
      display.show(true, 'main-menu', false, true);
      // Hide overlays
      display.slide('hide');
    });
    // Refresh musics list
    $(".options .refresh-music").click(function(){
      // Musics will be refresh
      _this.refreshed = true;
      // Show main menu
      display.show(true, 'loader', function(){
        scan.listDirectories(function(){
          error.display(30);
        });
      }, true);
      // Hide overlays
      display.slide('hide');
    });
    // Start a new game
    $(".new-game").click(function(){
      // Hide overlays (if necessary)
      display.slide('hide');
      _this.new();
    });
    // Load an existing game
    $(".load-game").click(function(){
      // If a game is available, load it
      if(!$(this).hasClass('btn-disabled'))
        _this.load();
    });
    // Continue game
    $(".continue-game").click(function(){
      _this.continue();
    });
    // Choose answer
    $(".game .choices").on('click', '.btn', function(){
      _this.answer($(this));
    });
  },
  // Get found musics
  _found: function(){
    var found = this.musics.slice(0); // Found musics
    var i = 0; // Iteration var
    var nbRemain = this.remain.length; // Number of musics remaining
    for(i; i < nbRemain; i++){
      var j = 0; // Iteration var
      var nbFound = found.length; // Number of musics found
      for(j; j < nbFound; j++){
        // If music if part of the remaining
        if(found[j].id == this.remain[i].id){
          // Remove it
          found.splice(j, 1);
          // Break the loop
          break;
        }
      }
    }
    // Return found musics array
    return found;
  },
  // Get a random integer between min and max different of exclusion
  rand: function(min, max, exclusion){
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
