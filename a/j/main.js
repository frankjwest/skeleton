/*******************************************************************
* launch                                                     v 1.0 *
*******************************************************************/

var fWcore = fWcore || {};

fWcore.launch = (function () {

  /*****************************************************************
  * init                                                     v 1.0 *
  *                                                                *
  * Init the main init function to load plugins                    *
  *                                                                *
  *****************************************************************/

  function init() {
    pageSetup();
  }

  /*****************************************************************
  * pageSetup                                                v 1.0 *
  *                                                                *
  * Standard page setup code run on every page load                *
  *                                                                *
  *****************************************************************/
  
  function pageSetup() {
    
    // Remove noJS class
    $('html').removeClass('noJS');
    
    // Setup offscreen menu events
    if (fWcore.settings.offScreenMenu) {
      var bodyDOM = $('body');
      $('.toggleMenuOn, .toggleMenuOff').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (bodyDOM.hasClass('showMenu')) {
          bodyDOM.removeClass('showMenu')
          $(document).off('click.menuVisible');
        } else {
          bodyDOM.addClass('showMenu')
          $(document).on('click.menuVisible', function(e) {
            e.preventDefault();
            $('.toggleMenuOn').trigger('click');
          });
        }
      });
    }
  }
  
  return {
    init: init
  };
    
})();


$(document).ready(function () {
  fWcore.launch.init();
});