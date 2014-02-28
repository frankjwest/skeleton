/*******************************************************************
* owlCustom                                                v 1.0 *
*                                                                  *
* Settings for any carousels being used on this website.           *
*                                                                  *
* Options can be found at http://owlgraphic.com/owlcarousel/       *
*                                                                  *
*******************************************************************/

var fwCore = fwCore || {};

fwCore.owlCustom = (function() {


  /*****************************************************************
  * init                                                     v 1.0 *
  *                                                                *
  * Initialise any carousels which have been defined.              *
  *                                                                *
  *****************************************************************/

  function init() {
  
    $('.carouselOne').owlCarousel({
      navigation : true,
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem : true,
      lazyLoad: true,
      pagination : false
    });
   
  }

  return {
    init: init
  };
    
})();