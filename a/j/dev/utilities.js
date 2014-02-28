/*******************************************************************
* Utilities                                                  v 1.0 *
*                                                                  *
* A group of functions and tools to be used through out projects   *
* and multiple plugins                                             *
*                                                                  *
*******************************************************************/

fwCore.utilities = (function() {


  /*****************************************************************
  * pageWash                                                 v 1.0 *
  *                                                                *
  * Sets a page wash to visible, auto creates markup if it doesn't *
  * already exist.                                                 *
  *                                                                *
  * Sets `settings.dom.wash` to true so the DOM doesn't need to be *
  * checked each time.                                             *
  *                                                                *
  * Adds `pageWashOn` class to body when the wash is active.       *
  *                                                                *
  * EVENTS                                                         *
  * Triggered events can be listened for under `fwPageWash`        *
  *                                                                *
  * Event properties                                               *
  * type :             fwPageWash                                  *
  * event :  off    :  Fired when a window is no longer visible    *
  *          failed :  Fired when the request content fails to load*
  *****************************************************************/

  pageWash = (function() {
  
    function init() {
      // Check if it has been initialised before
      if (!fwCore.settings.dom.pageWash) {
      
        // Only create the wash if it doesn't exist
        if ($('#pageWash').length <= 0) {
          $('body').append('<div id="pageWash"></div>');          
        }
        
        // Set pageWash to created
        fwCore.settings.dom.pageWash = true;
        
      }
    }
    
    function show() {
      $('body').addClass('pageWashOn');
      
      // Add keyboard event listener for escape key - Gets removed on hide.
      $('body').on('keydown.hideWash', function(e) {
        if (e.keyCode == 27) {
          hide();
        }
      });
    }
    
    function hide() {
      $.event.trigger({
        type: 'fwPageWash',
        event: 'off'
      });
      
      $('body').removeClass('pageWashOn');
      
      // Remove keyboard event listener for escape key
      $('body').off('keydown.hideWash');
    }
    
    return {
      init: init,
      show: show,
      hide: hide
    }
    
  })();
  
  
  
  return {
    pageWash: pageWash
  };
    
})();