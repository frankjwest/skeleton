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
/*******************************************************************
* modalWindow                                                v 1.0 *
*                                                                  *
* Flexible, responsive lightbox loading local or ajax loaded       *
* content.                                                         *
*                                                                  *
* Users focus will be set to the modal window on load and they     *
* will not be able to tab out of the window until it is closed.    *
*                                                                  *
* OPTIONS                                                          *
* All configuration options must be set as data attributes on the  *
* element used to launch the modal window.                         *
*                                                                  *
* data-container-id :Override option to use custom window ID       *
*                    Default is `modalWindow`                      *
*                                                                  *
* data-position :    Choose which position styling we want to      *
*                    use.                                          *
*                    `fullHeightfixed`: 90% height + auto scroll   *
*                    Dafault: auto height with absolute position   *
*                                                                  *
* data-content :     ID of container which holds the content to    *
*                    show in this lightbox.                        *
*                    Not needed if data-ajax is set.               *
*                                                                  *
* data-ajax :        url of content to be loaded via ajax          *
*                    Not needed if using data-content.             *
*                                                                  *
* data-data :        Data to be sent when making ajax request.     *
*                    Expected to be in JSON {'sample':'value'}     *
*                                                                  *
* EVENTS                                                           *
* Triggered events can be listened for under `fwModalWindow`       *
*                                                                  *
* Event properties                                                 *
* type :             fwModalWindow                                 *
* id :               The ID (string) of the window container       *
* event :  closed :  Fired when a window is no longer visible      *
*          failed :  Fired when the request content fails to load  *
*          loading:  Fired when the window is visible and content  *
*                    is still loading                              *
*          success:  Fired when the content has successfully       *
*                    loaded into the window                        *
*                                                                  *
*******************************************************************/

var fwCore = fwCore || {};

fwCore.modalWindow = (function() {


  /*****************************************************************
  * init                                                     v 1.0 *
  *                                                                *
  * Launch a modalWindow.                                          *
  *                                                                *
  * All content is loaded into a default modal window container    *
  * which is created on first use. Custom containers can be used   *
  * as an option on the launcher.                                  *
  *                                                                *
  * The page wash is generated using the standard fwCore utility.  *
  *                                                                *
  *****************************************************************/

  function init(launcherDOM) {
  
    // Use default window unless `containerID` is set
    var windowID = 'modalWindow';
    if (launcherDOM.data('container-id')) {
      windowID = launcherDOM.data('container-id');
    }
  
    // If not initialised before then setup plugin
    if (!fwCore.settings.pluginsInit.modalWindow) {
      fwCore.utilities.pageWash.init(); // Initialise page wash
      fwCore.settings.pluginsInit.modalWindow = true;
    }
    
    // Show page wash now, signifies to the user something is happening
    fwCore.utilities.pageWash.show();

    // Create the window if it doesn't exist
    createWindow(windowID); 
    
    // Once the window is created, we store the DOM element for use later on.
    windowDOM = $('#'+windowID);
    
    showWindow(windowDOM, launcherDOM);
    
    populateWindow(windowDOM, launcherDOM);
  }

  
  /*****************************************************************
  * showWindow                                               v 1.0 *
  *                                                                *
  * When a window is requested to be shown all styles are reset    *
  * and new ones applied. These can be overridden using options on *
  * the launcher.                                                  *
  *                                                                *
  * We use the style attribute in this `strange` way to make it    *
  * easier to inject IE fixed directly into the DOM as needed.     *
  *                                                                *
  *                                                                *
  * An event is triggered once the window is visible.              *
  *                                                                *
  *****************************************************************/

  function showWindow(windowDOM, launcherDOM) {
    // Reset all styles
    windowDOM.removeAttr('style');
    
    // Add new styles
    var fullHeightFixed = 'bottom: 5%; height: auto; overflow-y: auto; position: fixed; top: 5%; *position: absolute; *height: 90%;';
    var fluidHeightAbsolute = 'position: absolute; top: '+(50 + $(window).scrollTop())+'px; *height: 90%; *overflow-y: auto;';
    
    if (launcherDOM.data('position') == 'fullHeightFixed') {
      windowDOM.attr({'style' : fullHeightFixed});
    } else {
      windowDOM.attr({'style' : fluidHeightAbsolute});
    }

    // Show window
    windowDOM.show();
    
    // Trigger event: Window is now visible and content is loading
    $.event.trigger({
      type: 'fwModalWindow',
      event: 'loading',
      id: windowDOM.attr('id')
    });
  }

  
  /*****************************************************************
  * hideWindow                                               v 1.0 *
  *                                                                *
  * Once a window has been closed an event is triggered and the    *
  * content of this modal window is reset to the `loading` state.  *
  *                                                                *
  *****************************************************************/

  function hideWindow(windowDOM) {
    windowDOM.hide();

    // Trigger event: Window has been hidden
    $.event.trigger({
      type: 'fwModalWindow',
      event: 'closed',
      id: windowDOM.attr('id')
    });

    $('.modalContent', windowDOM).html(loadingTemplate());
  }

  
  /*****************************************************************
  * createWindow                                             v 1.0 *
  *                                                                *
  * All modal windows use the same template whether they are       *
  * custom or using the default. Once the defaults been created we *
  * flag a global setting to stop re-initialisation.               *
  *                                                                *
  * The structure of the modal window is defined by the            *
  * `windowTemplate` function.                                     *
  *                                                                *
  *****************************************************************/

  function createWindow(containerID) {
  
    // Check if using default modal window container or custom
    if (containerID) { // Custom container
      // Only create if it doesn't exist
      if ($('#'+containerID).length <= 0) {
        windowTemplate(containerID);
      }
    } else { // Default container
      // Create default container if it doesn't exist 
      if (!fwCore.settings.dom.modalWindow) {
        windowTemplate('modalWindow');
        fwCore.settings.dom.modalWindow = true;
      }
    }

    /*****************************************************************
    * windowTemplate                                           v 1.0 *
    *                                                                *
    * The markup for all modal windows, includes close button,       *
    * container for content injection and an accessible `jump to top`*
    *                                                                *
    *****************************************************************/
    
    function windowTemplate(containerID) {
      var html = '';
      html += '<div id="'+containerID+'" class="modalWindow">';
      html += '  <div class="modalClose">';
      html += '    <a href="" class="closeWindow">Close window</a>';
      html += '  </div>';
      html += '  <div class="modalContent">';
      html +=      loadingTemplate();
      html += '  </div>';
      html += '  <div class="modalFooter">';
      html += '    <a href="" class="visuallyHidden closeWindow">Close window</a>';
      html += '    <a href="" class="visuallyHidden endOfWindow">Jump to top of window</a>';
      html += '  </div>';
      html += '</div>';
      $('body').append(html);
      
      var thisWindowDOM = $('#'+containerID);
      var modalContent = $('.modalContent', thisWindowDOM);

      // Listen for wash closing, hide this window if the wash closes
      $(document).on('fwPageWash', function(e) {
        if (e.event == 'off') {
          hideWindow(thisWindowDOM);
        }
      });
      
      // Add hide event to `closeWindow` class within this window only
      $('.closeWindow', thisWindowDOM).on('click', function(e) {
        e.preventDefault();
        var modalCloseDOM = $(this);
        hideWindow(thisWindowDOM);
        fwCore.utilities.pageWash.hide();
      });
      
      // Add focus jump to `endOfWindow` to stop users from tabbing out of the modal window
      $('.endOfWindow', thisWindowDOM).on('click, focus', function(e) {
        e.preventDefault();
        $('.closeWindow:first', windowDOM).focus();
      });
    }

  }

  
  /*****************************************************************
  * loadingTemplate                                          v 1.0 *
  *                                                                *
  * The standard content to be displayed whilst content is being   *
  * loaded.                                                        *
  *                                                                *
  *****************************************************************/
  
  function loadingTemplate() {
    var HTML = '';
    HTML += '<p>Loading...</p>';
    return HTML;
  }
  
  
  /*****************************************************************
  * populateWindow                                           v 1.0 *
  *                                                                *
  * Inject content into a given modal window. The content source   *
  * is defined as an option on the launcher.                       *
  *                                                                *
  *****************************************************************/
  
  function populateWindow(windowDOM, launcherDOM) {
    // Populate content via ajax request
    if (launcherDOM.data('ajax')) {
    
      var data = '';
      if (launcherDOM.data('data')) {
        data = launcherDOM.data('data');
      }
    
      var requestContent = $.ajax({
        url: launcherDOM.data('ajax'),
        type: 'GET',
        data: data,
        dataType: 'html'
      });
       
      requestContent.done(function(response) {
        populationComplete('success', windowDOM, response);
      });
       
      requestContent.fail(function(jqXHR, textStatus) {
        populationComplete('failed', windowDOM, 'Sorry, we failed to load the content.');
      });
    
    // Populate content via local template
    } else if (launcherDOM.data('content')) {
      populationComplete('success', windowDOM, $('#'+launcherDOM.data('content')).html());
    // Content population hasn't been defined so show error
    } else {
      populationComplete('failed', windowDOM, 'Sorry, we failed to load the content.');
    }
    
    /*
      Simple function to inject content and launch event trigger
    */
    function populationComplete(result, windowDOM, content) {
      $('.modalContent', windowDOM).html(content);
      
      // Trigger event: Content has been loaded successfully 
      $.event.trigger({
        type: 'fwModalWindow',
        event: result,
        id: windowDOM.attr('id')
      });
      
      // Set focus to top of modal window
      $('.closeWindow:first', windowDOM).focus();
    }
    
  
  }
  
  
  return {
    init: init
  };
    
})();
/*****************************************************************
* settings                                                 v 1.0 *
*****************************************************************/

var fwCore = fwCore || {};

/*****************************************************************
* settings                                                 v 1.0 *
*                                                                *
* offScreenMenu:  true | false                                   *
*                 Is offscreen menu being used for this site?    *
* isSupported:    Object containing supported CSS features       *
* dom:            Object containing DOM elements which have been *
*                 created by plugins.                            *
*                 true = exists | false = not created yet        *
* pluginsInit     Object containing plugins which have been      *
*                 initialised.                                   *
*                                                                *
*****************************************************************/

fwCore.settings = {
  offScreenMenu: true,
  isSupported: {},
  dom: {
    pageWash: false,
    modalWindow: false
  },
  pluginsInit: {
    modalWindow: false
  }
};
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
          
          // Add close event to the wash on click
          var pageWashDOM = $('#pageWash');
          
          pageWashDOM.on('click', function() {
            hide();
          });
          
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