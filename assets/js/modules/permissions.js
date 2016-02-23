var perm = {
  // Allows to check permissions
  diagnostic: null,
  // Methods
  // Get a given permission
  get: function(permission){
    var _this = this;
    return new Promise(function(resolve, reject){
      _this.check(permission).then(function(result){
        _this.handle(result, permission).then(function(result){
          if(result)
            resolve(true);
          else
            resolve(false);
        }, function(error){
          console.log(error);
        });
      }, function(error){
        console.log(error);
      });
    });
  },
  // Check a given permission
  check: function(permission){
    var _this = this;
    return new Promise(function(resolve, reject){
      _this.diagnostic.getPermissionAuthorizationStatus(function(status){
        switch(status){
          case _this.diagnostic.runtimePermissionStatus.GRANTED :
            resolve('GRANTED');
          break;
          case _this.diagnostic.runtimePermissionStatus.NOT_REQUESTED :
            resolve('NOT_REQUESTED');
          break;
          case _this.diagnostic.runtimePermissionStatus.DENIED :
            resolve('DENIED');
          break;
          case _this.runtimePermissionStatus.DENIED_ALWAYS :
            resolve('DENIED_ALWAYS');
          break;
        }
      }, function(error){
        reject(error);
      }, _this.diagnostic.runtimePermission[permission]);
    });
  },
  handle: function(result, permission){
    var _this = this;
    return new Promise(function(resolve, reject){
      switch(result){
        case 'GRANTED' :
          resolve(true);
        break;
        case 'NOT_REQUESTED' :
          _this.ask(resolve, reject, permission);
        break;
        case 'DENIED' :
          _this.ask(resolve, reject, permission);
        break;
        case 'DENIED_ALWAYS' :
          resolve(false);
        break;
      }
    });
  },
  ask: function(resolve, reject, permission){
      this.diagnostic.requestRuntimePermission(function(result){
        if(result == 'GRANTED')
          resolve(true);
        resolve(false);
      }, function(error){
        reject(error);
      }, permission);
  }
}
