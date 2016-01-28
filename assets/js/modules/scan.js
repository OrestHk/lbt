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
  listDirectories: function(){
    var _this = this;
    var directory;
    // In case the user wants to refresh his inapp song list
    this.finished = false;
    // Display loader
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
    _this.initScan();
  },
  // Launch scan for each principal directories
  initScan: function(){
    var _this = this;
    var i = 0;
    var nbDirectories = this.directories.length;
    for(i; i < nbDirectories; i++){
      var directory = this.directories[i];
      window.resolveLocalFileSystemURL(directory, function(dir, callback){
        _this.folders++;
        _this.scanDirectory(dir);
      });
    }
  },
  // Scan the given directory for files or other directories
  scanDirectory: function(directory){
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
          _this.scanDirectory(entry);
        }
        // If entry is a file, check type
        else{
          // If it's an audio file add it to the musics
          window.resolveLocalFileSystemURL(entry.nativeURL, function(file, callback){
            _this.files++;
            file.file(function(file){
              // Check if file type is defined
              if(file.type != null && typeof file.type != 'undefined'){
                // Check if file is an audio file
                if(file.type.indexOf('audio') != -1)
                  _this.musics.push(file.localURL);
              }
              // File scanned !
              _this.scannedFiles++;
              // Check if all folders and files have been scanned
              if(_this.scannedFiles == _this.files && _this.scannedFolders == _this.folders && !_this.finished){
                _this.finished = true;
                _this.returnApp();
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
      }
    });
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
};
