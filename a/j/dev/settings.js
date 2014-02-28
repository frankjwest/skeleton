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
  modalWindow: true,
  owlCarousel: true,
  isSupported: {},
  dom: {
    pageWash: false,
    modalWindow: false
  },
  pluginsInit: {
    modalWindow: false
  }
};