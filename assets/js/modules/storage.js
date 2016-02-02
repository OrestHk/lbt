var storage = {
  // Vars
  musics: [],
  // Methods
  // Get musics from scan
  getMusics: function(musics){
    if(error.musicLength(musics))
      this.store(musics);
  },
  // Store founded music in current app instance and local storage
  store: function(musics){
    var _this = this;
    var i = 0;
    var treated = 0; // Count treated files (because of async file function)
    var nbMusics = musics.length;
    // Loop through each music to get metadata
    for(i; i < nbMusics; i++){
      window.resolveLocalFileSystemURL(musics[i], function(music, callback){
        // Get file metadata
        music.file(function(file){

          // Check if music already exists in list
          if(!_this.exist(file)){
            // Add an id to the file
            file.id = _this.musics.length;
            // Push file into storage musics
            _this.musics.push(file);
          }
          treated++;
          // Check if all musics have been scanned
          if(treated == nbMusics){
            _this.localStore();
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
      return true;
    }
    return false;
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
