var storage = {
  // Vars
  musics: [],
  // Methods
  // Get musics from scan
  getMusics: function(musics, callback){
    // Reset musics after new scan
    this.musics = [];
    // Check if enough musics
    if(error.musicLength(musics))
      // Store found musics
      this.store(musics, callback);
  },
  // Store founded music in current app instance and local storage
  store: function(musics, callback){
    var _this = this;
    var i = 0;
    var treated = 0; // Count treated files (because of async file function)
    var nbMusics = musics.length;
    // Loop through each music to get metadata
    for(i; i < nbMusics; i++){
      window.resolveLocalFileSystemURL(musics[i], function(music, cb){
        // Get file metadata
        music.file(function(file){
          // Check if music already exists in list
          if(!_this.exist(file)){
            // Add an id to the file
            file.id = _this.musics.length;
            // Add a stiped name (TO IMPROVE)
            file.stripName = _this.stripName(file.name);
            // Push file into storage musics
            _this.musics.push(file);
          }
          treated++;
          // Check if all musics have been scanned
          if(treated == nbMusics){
            // Store found musics
            _this.localStore();
            // Call callback if exist
            if(callback)
              callback();
            // Init the game
            else
              game.start();
          }
        });
      });
    }
  },
  // Store musics in device's localStorage
  localStore: function(){
    window.localStorage.removeItem('musics');
    window.localStorage.setItem('musics', JSON.stringify(this.musics));
  },
  // Get device's music stocked in localStorage
  getLocalStore: function(){
    var musics = window.localStorage.getItem('musics');
    // If music is found in localStorage
    if(musics != null && typeof musics != 'undefined'){
      // Parse it to set app's musics
      this.musics = JSON.parse(musics);
      game.musics = this.musics.slice(0);
      return true;
    }
    return false;
  },
  // Update user progression
  update: function(all){
    // If update all
    if(all){
      // Update remains
      window.localStorage.removeItem('remain');
      window.localStorage.setItem('remain', JSON.stringify(game.remain));
      // Update found
      window.localStorage.removeItem('found');
      window.localStorage.setItem('found', game.found);
    }
    // Update score
    window.localStorage.removeItem('score');
    window.localStorage.setItem('score', game.score);
  },
  // Get saved game data
  load: function(){
    var data = {
      score: JSON.parse(window.localStorage.getItem('score')),
      found: JSON.parse(window.localStorage.getItem('found')),
      remain: JSON.parse(window.localStorage.getItem('remain')),
    };
    return data;
  },
  // Check if user can load a game
  game: function(){
    var score = window.localStorage.getItem('score');
    var found = window.localStorage.getItem('found');
    var remain = window.localStorage.getItem('remain');
    // If remain is found in localStorage
    if(remain != null && typeof remain != 'undefined'){
      // If found is found in localStorage
      if(found != null && typeof found != 'undefined'){
        // If score is found in localStorage then game can be loaded
        if(score != null && typeof score != 'undefined')
          return true;
        return false;
      }
      return false;
    }
    return false;
  },
  // Clean song name
  stripName: function(name){
    // Remove extension
    var index = name.lastIndexOf('.');
    name = name.slice(0, index);
    // Replace [-_] by space
    name = name.replace(/[_-]/g, ' ');

    return name;
  },
  // Check if file already in musics
  exist: function(file){
    var i = 0;
    var nbMusics = this.musics.length;
    // Loop through each music to check if file already in here
    for(i; i < nbMusics; i++){
      // Check if files have the same name
      if(this.musics[i].name == file.name){
        // Check if files are of the same size
        if(this.musics[i].size == file.size){
          // Check if files have the same duration
          if(this.musics[i].end == file.end)
            return true;
        }
      }
    }
    // File doesn't exist
    return false;
  },
};
