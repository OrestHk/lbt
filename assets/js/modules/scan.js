var scan = {
  // Vars
  folders: 0, // Number of folder found during the scan
  files: 0, // Number of files found during the scan
  scannedFolders: 0, // Number of folder scanned
  scannedFiles: 0, // Number
  finished: false, // Check if scan already finished
  directories: [], // Directories to scan
  musics: [], // Musics found ont the device
  // List directories in which we'll look for the files we want
  listDirectories: function(callback){
    var _this = this;
    var directory;
    // In case the user wants to refresh his inapp song list
    this.resetScan();
    //console.log(this.folders, this.files, this.scannedFolders, this.scannedFiles, this.finished, this.directories.length, this.musics.length);
    // Show loader
    display.show(true, 'loader', function(){
      // Loop through cordova.file directories
      for(directory in cordova.file){
        var current = cordova.file[directory];
        if(current == null || typeof current == 'undefined')
          continue;

        current = _this.stripDirectory(current);
        if(_this.directories.indexOf(current) != -1)
          continue;

        _this.directories.push(current);
      }
      _this.initScan(callback);
    }, true);
  },
  // Launch scan for each principal directories
  initScan: function(callback){
    var _this = this;
    var i = 0;
    var nbDirectories = this.directories.length;
    for(i; i < nbDirectories; i++){
      var directory = this.directories[i];
      window.resolveLocalFileSystemURL(directory, function(dir, cb){
        _this.folders++;
        _this.scanDirectory(dir, callback);
      });
    }
  },
  // Scan the given directory for files or other directories
  scanDirectory: function(directory, callback){
    var _this = this;
    // Initiate a reader
    var reader = directory.createReader();
    // List entries in directory
    reader.readEntries(function(entries){
      var i = 0;
      var nbEntries = entries.length;
      // Loop through each entries in directory
      for(i; i < nbEntries; i++){
        var entry = entries[i];
        // If entry is a directory, scan the directory
        if(entry.isDirectory){
          _this.folders++;
          _this.scanDirectory(entry, callback);
        }
        // If entry is a file, check type
        else{
          // If it's an audio file add it to the musics
          window.resolveLocalFileSystemURL(entry.nativeURL, function(file, cb){
            _this.files++;
            file.file(function(file){
              // Check if file type is defined
              if(file.type != null && typeof file.type != 'undefined'){
                // Check if file is an audio file
                if(file.type.indexOf('audio') != -1 && _this.checkLengthSong(file) && _this.checkMimeType(file)){
                  _this.musics.push(file.localURL);
                }
              }
              // File scanned !
              _this.scannedFiles++;
              // Check if all folders and files have been scanned
              if(_this.scannedFiles == _this.files && _this.scannedFolders == _this.folders && !_this.finished){
                _this.finished = true;
                _this.returnApp();
                if(callback)
                  callback();
                //console.log(_this.folders, _this.files, _this.scannedFolders, _this.scannedFiles, _this.finished, _this.directories.length, _this.musics.length);
              }
            });
          });
          // Old method
          // if(entry.nativeURL.indexOf('\.mp3') != -1)
          //   _this.musics.push(entry.nativeURL);
        }
      }
      // Directory scanned !
      _this.scannedFolders++;
      // Check if all folders and files have been scanned
      if(_this.scannedFiles == _this.files && _this.scannedFolders == _this.folders && !_this.finished){
        _this.finished = true;
        _this.returnApp();
        if(callback)
          callback();
        //console.log(_this.folders, _this.files, _this.scannedFolders, _this.scannedFiles, _this.finished, _this.directories.length, _this.musics.length);
      }
    });
  },
  // Reset scan datas
  resetScan: function(){
    this.folders = 0;
    this.files = 0;
    this.scannedFolders = 0;
    this.scannedFiles = 0;
    this.finished = false;
    this.directories = [];
    this.musics = [];
  },
  // Return what was found to the app
  returnApp: function(){
    storage.getMusics(this.musics);
  },
  // Strip directory to one folder after root
  stripDirectory: function(directory){
    directory = directory.split(root)[1].split('/')[0];
    return root + directory + '/';
  },

  //check if file is user music or other app sound
  checkLengthSong: function(file){
    if(file.end > 1000000)
      return true;
    else
      return false;
  },

  checkMimeType:function(file){
    var mime = ['mp3','mp4','mpeg','wav'];
    var isUserFile = false;
    var fileMime = file.type.split('/')[1];

    for(var i = 0; i< mime.length - 1;i++){
      if(fileMime == mime[i])
        isUserFile = true;
    }

    return isUserFile;
  }
};
