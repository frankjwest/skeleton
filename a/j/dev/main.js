/*******************************************************************
* launch                                                     v 1.0 *
*                                                                  *
* Launches the JS framework, will initialise all core              *
* functionality                                                    *
*                                                                  *
*******************************************************************/

var fwCore = fwCore || {};

fwCore.launch = (function() {


  /*****************************************************************
  * init                                                     v 1.0 *
  *                                                                *
  * Init the main init function to load plugins                    *
  *                                                                *
  *****************************************************************/

  function init() {
    $('html').removeClass('noJS'); // Enable JavaScript mode
    offScreenMenu(); // Activate off screen menu
    fwCore.scrollToTop.init(); // Activate default scroll to top functionality
  }

  
  /*****************************************************************
  * offScreenMenu                                            v 1.0 *
  *                                                                *
  * Switches menu classes to toggle menu on or off screen, will    *
  * slide in via transitions in modern browsers.                   *
  *                                                                *
  *****************************************************************/

  function offScreenMenu() {
    // Setup offscreen menu events
    if (fwCore.settings.offScreenMenu) {
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



/*******************************************************************
* scrollToTop                                                v 1.0 *
*                                                                  *
* Plugin for scrolling to the top of the page, or a given element  *
*                                                                  *
*******************************************************************/

fwCore.scrollToTop = (function() {


  /*****************************************************************
  * init                                                     v 1.0 *
  *                                                                *
  * Initialises scroll to top on standard elements                 *
  *                                                                *
  *****************************************************************/

  function init() {
    scrollTo($('.backToTop'), $('#top'), 1000);
  }


  /*****************************************************************
  * scrollTo                                                 v 1.0 *
  *                                                                *
  * Scrolls to a given element upon clicking another element.      *
  *                                                                *
  * Options                                                        *
  * clicked: HTML object of element to be clicked                  *
  * target: HTML object of element to scroll to                    *
  * time: Time to spend scrolling in MS                            *
  *                                                                *
  *****************************************************************/
  
  function scrollTo(clicked, target, time) {
    clicked.on('click', function(e) {
      e.preventDefault();
      $('html, body, document').animate({
        scrollTop: target.offset().top
      }, time);
    });
  }
  
  return {
    init: init,
    scrollTo: scrollTo
  };
    
})();



/*******************************************************************
* Let it begin                                                     *
*******************************************************************/

$(document).ready(function() {
  fwCore.launch.init();
  
  $('.devButton').on('click', function(e) {
    e.preventDefault();
    fwCore.modalWindow.init($(this));
  });

});