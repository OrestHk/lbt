var display = {
  // Vars
  duration: 300,
  screens: $(".screen"),
  overlays: $(".overlay"),
  // Methods
  // Show/Hide a screen
  show: function(show, element, callback, hideOthers){
    // Dom element
    var el = $("."+element);
    // Hide or show
    var display = show ? 'fadeIn' : 'fadeOut';
    // Check if need to hide other screen
    if(hideOthers)
      this.screens.not('.'+element).fadeOut(this.duration);
    // Show element
    el[display](this.duration, function(){
      // If callback exist, execute it
      if(callback)
        callback();
    });
  },
  // Show/Hide an overlay, slide animation
  slide: function(type, element, callback){
    // Dom element
    var el = element ? $("."+element) : this.overlays;
    // Hide or show animation
    var left = type == 'show' ? 0 : '-100%';
    // Show element
    el.animate({
      left: left
    }, 300, function(){
      // If callback exist, execute it
      if(callback)
        callback();
    })
  }
};
