var perm = {
  // Allows to check permissions
  diagnostic: null,
  // Methods
  // Get a given permission
  get: function(permission){
    this.check(permission).then(function(result){
      console.log(result);
    }, function(error){
      console.log(error);
    });
  },
  // Check a given permission
  check: function(permission){
    var _this = this;
    return new Promise(function(resolve, reject){
      _this.diagnostic.getPermissionAuthorizationStatus(function(status){
        switch(status){
          case _this.diagnostic.runtimePermissionStatus.GRANTED :
            console.log('here');
            resolve('GRANTED');
          break;
          case _this.diagnostic.runtimePermissionStatus.NOT_REQUESTED :
            console.log('here1');
            resolve('NOT_REQUESTED');
          break;
          case _this.diagnostic.runtimePermissionStatus.DENIED :
            console.log('here2');
            resolve('DENIED');
          break;
          case _this.runtimePermissionStatus.DENIED_ALWAYS :
            console.log('here3');
            resolve('DENIED_ALWAYS');
          break;
        }
      }, function(error){
        reject(error)
      }, _this.diagnostic.runtimePermission[permission]);
    });
  }
}
