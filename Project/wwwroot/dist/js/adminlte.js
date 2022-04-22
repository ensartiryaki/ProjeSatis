/*!
 * AdminLTE v3.1.0 (https://adminlte.io)
 * Copyright 2014-2021 Colorlib <https://colorlib.com>
 * Licensed under MIT (https://github.com/ColorlibHQ/AdminLTE/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.adminlte = {}, global.jQuery));
}(this, (function (exports, $) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /**
   * --------------------------------------------
   * AdminLTE CardRefresh.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$e = 'CardRefresh';
  var DATA_KEY$e = 'lte.cardrefresh';
  var EVENT_KEY$7 = "." + DATA_KEY$e;
  var JQUERY_NO_CONFLICT$e = $__default['default'].fn[NAME$e];
  var EVENT_LOADED = "loaded" + EVENT_KEY$7;
  var EVENT_OVERLAY_ADDED = "overlay.added" + EVENT_KEY$7;
  var EVENT_OVERLAY_REMOVED = "overlay.removed" + EVENT_KEY$7;
  var CLASS_NAME_CARD$1 = 'card';
  var SELECTOR_CARD$1 = "." + CLASS_NAME_CARD$1;
  var SELECTOR_DATA_REFRESH = '[data-card-widget="card-refresh"]';
  var Default$c = {
    source: '',
    sourceSelector: '',
    params: {},
    trigger: SELECTOR_DATA_REFRESH,
    content: '.card-body',
    loadInContent: true,
    loadOnInit: true,
    responseType: '',
    overlayTemplate: '<div class="overlay"><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>',
    onLoadStart: function onLoadStart() {},
    onLoadDone: function onLoadDone(response) {
      return response;
    }
  };

  var CardRefresh = /*#__PURE__*/function () {
    function CardRefresh(element, settings) {
      this._element = element;
      this._parent = element.parents(SELECTOR_CARD$1).first();
      this._settings = $__default['default'].extend({}, Default$c, settings);
      this._overlay = $__default['default'](this._settings.overlayTemplate);

      if (element.hasClass(CLASS_NAME_CARD$1)) {
        this._parent = element;
      }

      if (this._settings.source === '') {
        throw new Error('Source url was not defined. Please specify a url in your CardRefresh source option.');
      }
    }

    var _proto = CardRefresh.prototype;

    _proto.load = function load() {
      var _this = this;

      this._addOverlay();

      this._settings.onLoadStart.call($__default['default'](this));

      $__default['default'].get(this._settings.source, this._settings.params, function (response) {
        if (_this._settings.loadInContent) {
          if (_this._settings.sourceSelector !== '') {
            response = $__default['default'](response).find(_this._settings.sourceSelector).html();
          }

          _this._parent.find(_this._settings.content).html(response);
        }

        _this._settings.onLoadDone.call($__default['default'](_this), response);

        _this._removeOverlay();
      }, this._settings.responseType !== '' && this._settings.responseType);
      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_LOADED));
    };

    _proto._addOverlay = function _addOverlay() {
      this._parent.append(this._overlay);

      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_OVERLAY_ADDED));
    };

    _proto._removeOverlay = function _removeOverlay() {
      this._parent.find(this._overlay).remove();

      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_OVERLAY_REMOVED));
    } // Private
    ;

    _proto._init = function _init() {
      var _this2 = this;

      $__default['default'](this).find(this._settings.trigger).on('click', function () {
        _this2.load();
      });

      if (this._settings.loadOnInit) {
        this.load();
      }
    } // Static
    ;

    CardRefresh._jQueryInterface = function _jQueryInterface(config) {
      var data = $__default['default'](this).data(DATA_KEY$e);

      var _options = $__default['default'].extend({}, Default$c, $__default['default'](this).data());

      if (!data) {
        data = new CardRefresh($__default['default'](this), _options);
        $__default['default'](this).data(DATA_KEY$e, typeof config === 'string' ? data : config);
      }

      if (typeof config === 'string' && /load/.test(config)) {
        data[config]();
      } else {
        data._init($__default['default'](this));
      }
    };

    return CardRefresh;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](document).on('click', SELECTOR_DATA_REFRESH, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardRefresh._jQueryInterface.call($__default['default'](this), 'load');
  });
  $__default['default'](function () {
    $__default['default'](SELECTOR_DATA_REFRESH).each(function () {
      CardRefresh._jQueryInterface.call($__default['default'](this));
    });
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$e] = CardRefresh._jQueryInterface;
  $__default['default'].fn[NAME$e].Constructor = CardRefresh;

  $__default['default'].fn[NAME$e].noConflict = function () {
    $__default['default'].fn[NAME$e] = JQUERY_NO_CONFLICT$e;
    return CardRefresh._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE CardWidget.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$d = 'CardWidget';
  var DATA_KEY$d = 'lte.cardwidget';
  var EVENT_KEY$6 = "." + DATA_KEY$d;
  var JQUERY_NO_CONFLICT$d = $__default['default'].fn[NAME$d];
  var EVENT_EXPANDED$3 = "expanded" + EVENT_KEY$6;
  var EVENT_COLLAPSED$4 = "collapsed" + EVENT_KEY$6;
  var EVENT_MAXIMIZED = "maximized" + EVENT_KEY$6;
  var EVENT_MINIMIZED = "minimized" + EVENT_KEY$6;
  var EVENT_REMOVED$1 = "removed" + EVENT_KEY$6;
  var CLASS_NAME_CARD = 'card';
  var CLASS_NAME_COLLAPSED$1 = 'collapsed-card';
  var CLASS_NAME_COLLAPSING = 'collapsing-card';
  var CLASS_NAME_EXPANDING = 'expanding-card';
  var CLASS_NAME_WAS_COLLAPSED = 'was-collapsed';
  var CLASS_NAME_MAXIMIZED = 'maximized-card';
  var SELECTOR_DATA_REMOVE = '[data-card-widget="remove"]';
  var SELECTOR_DATA_COLLAPSE = '[data-card-widget="collapse"]';
  var SELECTOR_DATA_MAXIMIZE = '[data-card-widget="maximize"]';
  var SELECTOR_CARD = "." + CLASS_NAME_CARD;
  var SELECTOR_CARD_HEADER = '.card-header';
  var SELECTOR_CARD_BODY = '.card-body';
  var SELECTOR_CARD_FOOTER = '.card-footer';
  var Default$b = {
    animationSpeed: 'normal',
    collapseTrigger: SELECTOR_DATA_COLLAPSE,
    removeTrigger: SELECTOR_DATA_REMOVE,
    maximizeTrigger: SELECTOR_DATA_MAXIMIZE,
    collapseIcon: 'fa-minus',
    expandIcon: 'fa-plus',
    maximizeIcon: 'fa-expand',
    minimizeIcon: 'fa-compress'
  };

  var CardWidget = /*#__PURE__*/function () {
    function CardWidget(element, settings) {
      this._element = element;
      this._parent = element.parents(SELECTOR_CARD).first();

      if (element.hasClass(CLASS_NAME_CARD)) {
        this._parent = element;
      }

      this._settings = $__default['default'].extend({}, Default$b, settings);
    }

    var _proto = CardWidget.prototype;

    _proto.collapse = function collapse() {
      var _this = this;

      this._parent.addClass(CLASS_NAME_COLLAPSING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideUp(this._settings.animationSpeed, function () {
        _this._parent.addClass(CLASS_NAME_COLLAPSED$1).removeClass(CLASS_NAME_COLLAPSING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.collapseIcon).addClass(this._settings.expandIcon).removeClass(this._settings.collapseIcon);

      this._element.trigger($__default['default'].Event(EVENT_COLLAPSED$4), this._parent);
    };

    _proto.expand = function expand() {
      var _this2 = this;

      this._parent.addClass(CLASS_NAME_EXPANDING).children(SELECTOR_CARD_BODY + ", " + SELECTOR_CARD_FOOTER).slideDown(this._settings.animationSpeed, function () {
        _this2._parent.removeClass(CLASS_NAME_COLLAPSED$1).removeClass(CLASS_NAME_EXPANDING);
      });

      this._parent.find("> " + SELECTOR_CARD_HEADER + " " + this._settings.collapseTrigger + " ." + this._settings.expandIcon).addClass(this._settings.collapseIcon).removeClass(this._settings.expandIcon);

      this._element.trigger($__default['default'].Event(EVENT_EXPANDED$3), this._parent);
    };

    _proto.remove = function remove() {
      this._parent.slideUp();

      this._element.trigger($__default['default'].Event(EVENT_REMOVED$1), this._parent);
    };

    _proto.toggle = function toggle() {
      if (this._parent.hasClass(CLASS_NAME_COLLAPSED$1)) {
        this.expand();
        return;
      }

      this.collapse();
    };

    _proto.maximize = function maximize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.maximizeIcon).addClass(this._settings.minimizeIcon).removeClass(this._settings.maximizeIcon);

      this._parent.css({
        height: this._parent.height(),
        width: this._parent.width(),
        transition: 'all .15s'
      }).delay(150).queue(function () {
        var $element = $__default['default'](this);
        $element.addClass(CLASS_NAME_MAXIMIZED);
        $__default['default']('html').addClass(CLASS_NAME_MAXIMIZED);

        if ($element.hasClass(CLASS_NAME_COLLAPSED$1)) {
          $element.addClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($__default['default'].Event(EVENT_MAXIMIZED), this._parent);
    };

    _proto.minimize = function minimize() {
      this._parent.find(this._settings.maximizeTrigger + " ." + this._settings.minimizeIcon).addClass(this._settings.maximizeIcon).removeClass(this._settings.minimizeIcon);

      this._parent.css('cssText', "height: " + this._parent[0].style.height + " !important; width: " + this._parent[0].style.width + " !important; transition: all .15s;").delay(10).queue(function () {
        var $element = $__default['default'](this);
        $element.removeClass(CLASS_NAME_MAXIMIZED);
        $__default['default']('html').removeClass(CLASS_NAME_MAXIMIZED);
        $element.css({
          height: 'inherit',
          width: 'inherit'
        });

        if ($element.hasClass(CLASS_NAME_WAS_COLLAPSED)) {
          $element.removeClass(CLASS_NAME_WAS_COLLAPSED);
        }

        $element.dequeue();
      });

      this._element.trigger($__default['default'].Event(EVENT_MINIMIZED), this._parent);
    };

    _proto.toggleMaximize = function toggleMaximize() {
      if (this._parent.hasClass(CLASS_NAME_MAXIMIZED)) {
        this.minimize();
        return;
      }

      this.maximize();
    } // Private
    ;

    _proto._init = function _init(card) {
      var _this3 = this;

      this._parent = card;
      $__default['default'](this).find(this._settings.collapseTrigger).click(function () {
        _this3.toggle();
      });
      $__default['default'](this).find(this._settings.maximizeTrigger).click(function () {
        _this3.toggleMaximize();
      });
      $__default['default'](this).find(this._settings.removeTrigger).click(function () {
        _this3.remove();
      });
    } // Static
    ;

    CardWidget._jQueryInterface = function _jQueryInterface(config) {
      var data = $__default['default'](this).data(DATA_KEY$d);

      var _options = $__default['default'].extend({}, Default$b, $__default['default'](this).data());

      if (!data) {
        data = new CardWidget($__default['default'](this), _options);
        $__default['default'](this).data(DATA_KEY$d, typeof config === 'string' ? data : config);
      }

      if (typeof config === 'string' && /collapse|expand|remove|toggle|maximize|minimize|toggleMaximize/.test(config)) {
        data[config]();
      } else if (typeof config === 'object') {
        data._init($__default['default'](this));
      }
    };

    return CardWidget;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](document).on('click', SELECTOR_DATA_COLLAPSE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default['default'](this), 'toggle');
  });
  $__default['default'](document).on('click', SELECTOR_DATA_REMOVE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default['default'](this), 'remove');
  });
  $__default['default'](document).on('click', SELECTOR_DATA_MAXIMIZE, function (event) {
    if (event) {
      event.preventDefault();
    }

    CardWidget._jQueryInterface.call($__default['default'](this), 'toggleMaximize');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$d] = CardWidget._jQueryInterface;
  $__default['default'].fn[NAME$d].Constructor = CardWidget;

  $__default['default'].fn[NAME$d].noConflict = function () {
    $__default['default'].fn[NAME$d] = JQUERY_NO_CONFLICT$d;
    return CardWidget._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE ControlSidebar.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$c = 'ControlSidebar';
  var DATA_KEY$c = 'lte.controlsidebar';
  var EVENT_KEY$5 = "." + DATA_KEY$c;
  var JQUERY_NO_CONFLICT$c = $__default['default'].fn[NAME$c];
  var EVENT_COLLAPSED$3 = "collapsed" + EVENT_KEY$5;
  var EVENT_EXPANDED$2 = "expanded" + EVENT_KEY$5;
  var SELECTOR_CONTROL_SIDEBAR = '.control-sidebar';
  var SELECTOR_CONTROL_SIDEBAR_CONTENT$1 = '.control-sidebar-content';
  var SELECTOR_DATA_TOGGLE$4 = '[data-widget="control-sidebar"]';
  var SELECTOR_HEADER$1 = '.main-header';
  var SELECTOR_FOOTER$1 = '.main-footer';
  var CLASS_NAME_CONTROL_SIDEBAR_ANIMATE = 'control-sidebar-animate';
  var CLASS_NAME_CONTROL_SIDEBAR_OPEN$1 = 'control-sidebar-open';
  var CLASS_NAME_CONTROL_SIDEBAR_SLIDE = 'control-sidebar-slide-open';
  var CLASS_NAME_LAYOUT_FIXED$1 = 'layout-fixed';
  var CLASS_NAME_NAVBAR_FIXED = 'layout-navbar-fixed';
  var CLASS_NAME_NAVBAR_SM_FIXED = 'layout-sm-navbar-fixed';
  var CLASS_NAME_NAVBAR_MD_FIXED = 'layout-md-navbar-fixed';
  var CLASS_NAME_NAVBAR_LG_FIXED = 'layout-lg-navbar-fixed';
  var CLASS_NAME_NAVBAR_XL_FIXED = 'layout-xl-navbar-fixed';
  var CLASS_NAME_FOOTER_FIXED = 'layout-footer-fixed';
  var CLASS_NAME_FOOTER_SM_FIXED = 'layout-sm-footer-fixed';
  var CLASS_NAME_FOOTER_MD_FIXED = 'layout-md-footer-fixed';
  var CLASS_NAME_FOOTER_LG_FIXED = 'layout-lg-footer-fixed';
  var CLASS_NAME_FOOTER_XL_FIXED = 'layout-xl-footer-fixed';
  var Default$a = {
    controlsidebarSlide: true,
    scrollbarTheme: 'os-theme-light',
    scrollbarAutoHide: 'l',
    target: SELECTOR_CONTROL_SIDEBAR
  };
  /**
   * Class Definition
   * ====================================================
   */

  var ControlSidebar = /*#__PURE__*/function () {
    function ControlSidebar(element, config) {
      this._element = element;
      this._config = config;
    } // Public


    var _proto = ControlSidebar.prototype;

    _proto.collapse = function collapse() {
      var $body = $__default['default']('body');
      var $html = $__default['default']('html');
      var target = this._config.target; // Show the control sidebar

      if (this._config.controlsidebarSlide) {
        $html.addClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
        $body.removeClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE).delay(300).queue(function () {
          $__default['default'](target).hide();
          $html.removeClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
          $__default['default'](this).dequeue();
        });
      } else {
        $body.removeClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1);
      }

      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_COLLAPSED$3));
    };

    _proto.show = function show() {
      var $body = $__default['default']('body');
      var $html = $__default['default']('html'); // Collapse the control sidebar

      if (this._config.controlsidebarSlide) {
        $html.addClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
        $__default['default'](this._config.target).show().delay(10).queue(function () {
          $body.addClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE).delay(300).queue(function () {
            $html.removeClass(CLASS_NAME_CONTROL_SIDEBAR_ANIMATE);
            $__default['default'](this).dequeue();
          });
          $__default['default'](this).dequeue();
        });
      } else {
        $body.addClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1);
      }

      this._fixHeight();

      this._fixScrollHeight();

      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_EXPANDED$2));
    };

    _proto.toggle = function toggle() {
      var $body = $__default['default']('body');
      var shouldClose = $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE);

      if (shouldClose) {
        // Close the control sidebar
        this.collapse();
      } else {
        // Open the control sidebar
        this.show();
      }
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      var $body = $__default['default']('body');
      var shouldNotHideAll = $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE);

      if (shouldNotHideAll) {
        $__default['default'](SELECTOR_CONTROL_SIDEBAR).not(this._config.target).hide();
        $__default['default'](this._config.target).css('display', 'block');
      } else {
        $__default['default'](SELECTOR_CONTROL_SIDEBAR).hide();
      }

      this._fixHeight();

      this._fixScrollHeight();

      $__default['default'](window).resize(function () {
        _this._fixHeight();

        _this._fixScrollHeight();
      });
      $__default['default'](window).scroll(function () {
        var $body = $__default['default']('body');
        var shouldFixHeight = $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN$1) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE);

        if (shouldFixHeight) {
          _this._fixScrollHeight();
        }
      });
    };

    _proto._isNavbarFixed = function _isNavbarFixed() {
      var $body = $__default['default']('body');
      return $body.hasClass(CLASS_NAME_NAVBAR_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_SM_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_MD_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_LG_FIXED) || $body.hasClass(CLASS_NAME_NAVBAR_XL_FIXED);
    };

    _proto._isFooterFixed = function _isFooterFixed() {
      var $body = $__default['default']('body');
      return $body.hasClass(CLASS_NAME_FOOTER_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_SM_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_MD_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_LG_FIXED) || $body.hasClass(CLASS_NAME_FOOTER_XL_FIXED);
    };

    _proto._fixScrollHeight = function _fixScrollHeight() {
      var $body = $__default['default']('body');
      var $controlSidebar = $__default['default'](this._config.target);

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED$1)) {
        return;
      }

      var heights = {
        scroll: $__default['default'](document).height(),
        window: $__default['default'](window).height(),
        header: $__default['default'](SELECTOR_HEADER$1).outerHeight(),
        footer: $__default['default'](SELECTOR_FOOTER$1).outerHeight()
      };
      var positions = {
        bottom: Math.abs(heights.window + $__default['default'](window).scrollTop() - heights.scroll),
        top: $__default['default'](window).scrollTop()
      };
      var navbarFixed = this._isNavbarFixed() && $__default['default'](SELECTOR_HEADER$1).css('position') === 'fixed';
      var footerFixed = this._isFooterFixed() && $__default['default'](SELECTOR_FOOTER$1).css('position') === 'fixed';
      var $controlsidebarContent = $__default['default'](this._config.target + ", " + this._config.target + " " + SELECTOR_CONTROL_SIDEBAR_CONTENT$1);

      if (positions.top === 0 && positions.bottom === 0) {
        $controlSidebar.css({
          bottom: heights.footer,
          top: heights.header
        });
        $controlsidebarContent.css('height', heights.window - (heights.header + heights.footer));
      } else if (positions.bottom <= heights.footer) {
        if (footerFixed === false) {
          var top = heights.header - positions.top;
          $controlSidebar.css('bottom', heights.footer - positions.bottom).css('top', top >= 0 ? top : 0);
          $controlsidebarContent.css('height', heights.window - (heights.footer - positions.bottom));
        } else {
          $controlSidebar.css('bottom', heights.footer);
        }
      } else if (positions.top <= heights.header) {
        if (navbarFixed === false) {
          $controlSidebar.css('top', heights.header - positions.top);
          $controlsidebarContent.css('height', heights.window - (heights.header - positions.top));
        } else {
          $controlSidebar.css('top', heights.header);
        }
      } else if (navbarFixed === false) {
        $controlSidebar.css('top', 0);
        $controlsidebarContent.css('height', heights.window);
      } else {
        $controlSidebar.css('top', heights.header);
      }

      if (footerFixed && navbarFixed) {
        $controlsidebarContent.css('height', '100%');
        $controlSidebar.css('height', '');
      } else if (footerFixed || navbarFixed) {
        $controlsidebarContent.css('height', '100%');
        $controlsidebarContent.css('height', '');
      }
    };

    _proto._fixHeight = function _fixHeight() {
      var $body = $__default['default']('body');
      var $controlSidebar = $__default['default'](this._config.target + " " + SELECTOR_CONTROL_SIDEBAR_CONTENT$1);

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED$1)) {
        $controlSidebar.attr('style', '');
        return;
      }

      var heights = {
        window: $__default['default'](window).height(),
        header: $__default['default'](SELECTOR_HEADER$1).outerHeight(),
        footer: $__default['default'](SELECTOR_FOOTER$1).outerHeight()
      };
      var sidebarHeight = heights.window - heights.header;

      if (this._isFooterFixed() && $__default['default'](SELECTOR_FOOTER$1).css('position') === 'fixed') {
        sidebarHeight = heights.window - heights.header - heights.footer;
      }

      $controlSidebar.css('height', sidebarHeight);

      if (typeof $__default['default'].fn.overlayScrollbars !== 'undefined') {
        $controlSidebar.overlayScrollbars({
          className: this._config.scrollbarTheme,
          sizeAutoCapable: true,
          scrollbars: {
            autoHide: this._config.scrollbarAutoHide,
            clickScrolling: true
          }
        });
      }
    } // Static
    ;

    ControlSidebar._jQueryInterface = function _jQueryInterface(operation) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$c);

        var _options = $__default['default'].extend({}, Default$a, $__default['default'](this).data());

        if (!data) {
          data = new ControlSidebar(this, _options);
          $__default['default'](this).data(DATA_KEY$c, data);
        }

        if (data[operation] === 'undefined') {
          throw new Error(operation + " is not a function");
        }

        data[operation]();
      });
    };

    return ControlSidebar;
  }();
  /**
   *
   * Data Api implementation
   * ====================================================
   */


  $__default['default'](document).on('click', SELECTOR_DATA_TOGGLE$4, function (event) {
    event.preventDefault();

    ControlSidebar._jQueryInterface.call($__default['default'](this), 'toggle');
  });
  $__default['default'](document).ready(function () {
    ControlSidebar._jQueryInterface.call($__default['default'](SELECTOR_DATA_TOGGLE$4), '_init');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$c] = ControlSidebar._jQueryInterface;
  $__default['default'].fn[NAME$c].Constructor = ControlSidebar;

  $__default['default'].fn[NAME$c].noConflict = function () {
    $__default['default'].fn[NAME$c] = JQUERY_NO_CONFLICT$c;
    return ControlSidebar._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE DirectChat.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$b = 'DirectChat';
  var DATA_KEY$b = 'lte.directchat';
  var EVENT_KEY$4 = "." + DATA_KEY$b;
  var JQUERY_NO_CONFLICT$b = $__default['default'].fn[NAME$b];
  var EVENT_TOGGLED = "toggled" + EVENT_KEY$4;
  var SELECTOR_DATA_TOGGLE$3 = '[data-widget="chat-pane-toggle"]';
  var SELECTOR_DIRECT_CHAT = '.direct-chat';
  var CLASS_NAME_DIRECT_CHAT_OPEN = 'direct-chat-contacts-open';
  /**
   * Class Definition
   * ====================================================
   */

  var DirectChat = /*#__PURE__*/function () {
    function DirectChat(element) {
      this._element = element;
    }

    var _proto = DirectChat.prototype;

    _proto.toggle = function toggle() {
      $__default['default'](this._element).parents(SELECTOR_DIRECT_CHAT).first().toggleClass(CLASS_NAME_DIRECT_CHAT_OPEN);
      $__default['default'](this._element).trigger($__default['default'].Event(EVENT_TOGGLED));
    } // Static
    ;

    DirectChat._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$b);

        if (!data) {
          data = new DirectChat($__default['default'](this));
          $__default['default'](this).data(DATA_KEY$b, data);
        }

        data[config]();
      });
    };

    return DirectChat;
  }();
  /**
   *
   * Data Api implementation
   * ====================================================
   */


  $__default['default'](document).on('click', SELECTOR_DATA_TOGGLE$3, function (event) {
    if (event) {
      event.preventDefault();
    }

    DirectChat._jQueryInterface.call($__default['default'](this), 'toggle');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$b] = DirectChat._jQueryInterface;
  $__default['default'].fn[NAME$b].Constructor = DirectChat;

  $__default['default'].fn[NAME$b].noConflict = function () {
    $__default['default'].fn[NAME$b] = JQUERY_NO_CONFLICT$b;
    return DirectChat._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Dropdown.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$a = 'Dropdown';
  var DATA_KEY$a = 'lte.dropdown';
  var JQUERY_NO_CONFLICT$a = $__default['default'].fn[NAME$a];
  var SELECTOR_NAVBAR = '.navbar';
  var SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
  var SELECTOR_DROPDOWN_MENU_ACTIVE = '.dropdown-menu.show';
  var SELECTOR_DROPDOWN_TOGGLE = '[data-toggle="dropdown"]';
  var CLASS_NAME_DROPDOWN_RIGHT = 'dropdown-menu-right';
  var CLASS_NAME_DROPDOWN_SUBMENU = 'dropdown-submenu'; // TODO: this is unused; should be removed along with the extend?

  var Default$9 = {};
  /**
   * Class Definition
   * ====================================================
   */

  var Dropdown = /*#__PURE__*/function () {
    function Dropdown(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Dropdown.prototype;

    _proto.toggleSubmenu = function toggleSubmenu() {
      this._element.siblings().show().toggleClass('show');

      if (!this._element.next().hasClass('show')) {
        this._element.parents(SELECTOR_DROPDOWN_MENU).first().find('.show').removeClass('show').hide();
      }

      this._element.parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function () {
        $__default['default']('.dropdown-submenu .show').removeClass('show').hide();
      });
    };

    _proto.fixPosition = function fixPosition() {
      var $element = $__default['default'](SELECTOR_DROPDOWN_MENU_ACTIVE);

      if ($element.length === 0) {
        return;
      }

      if ($element.hasClass(CLASS_NAME_DROPDOWN_RIGHT)) {
        $element.css({
          left: 'inherit',
          right: 0
        });
      } else {
        $element.css({
          left: 0,
          right: 'inherit'
        });
      }

      var offset = $element.offset();
      var width = $element.width();
      var visiblePart = $__default['default'](window).width() - offset.left;

      if (offset.left < 0) {
        $element.css({
          left: 'inherit',
          right: offset.left - 5
        });
      } else if (visiblePart < width) {
        $element.css({
          left: 'inherit',
          right: 0
        });
      }
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$a);

        var _config = $__default['default'].extend({}, Default$9, $__default['default'](this).data());

        if (!data) {
          data = new Dropdown($__default['default'](this), _config);
          $__default['default'](this).data(DATA_KEY$a, data);
        }

        if (config === 'toggleSubmenu' || config === 'fixPosition') {
          data[config]();
        }
      });
    };

    return Dropdown;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](SELECTOR_DROPDOWN_MENU + " " + SELECTOR_DROPDOWN_TOGGLE).on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($__default['default'](this), 'toggleSubmenu');
  });
  $__default['default'](SELECTOR_NAVBAR + " " + SELECTOR_DROPDOWN_TOGGLE).on('click', function (event) {
    event.preventDefault();

    if ($__default['default'](event.target).parent().hasClass(CLASS_NAME_DROPDOWN_SUBMENU)) {
      return;
    }

    setTimeout(function () {
      Dropdown._jQueryInterface.call($__default['default'](this), 'fixPosition');
    }, 1);
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$a] = Dropdown._jQueryInterface;
  $__default['default'].fn[NAME$a].Constructor = Dropdown;

  $__default['default'].fn[NAME$a].noConflict = function () {
    $__default['default'].fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Dropdown._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE ExpandableTable.js
   * License MIT
   * --------------------------------------------
   */
  /**
    * Constants
    * ====================================================
    */

  var NAME$9 = 'ExpandableTable';
  var DATA_KEY$9 = 'lte.expandableTable';
  var EVENT_KEY$3 = "." + DATA_KEY$9;
  var JQUERY_NO_CONFLICT$9 = $__default['default'].fn[NAME$9];
  var EVENT_EXPANDED$1 = "expanded" + EVENT_KEY$3;
  var EVENT_COLLAPSED$2 = "collapsed" + EVENT_KEY$3;
  var SELECTOR_TABLE = '.expandable-table';
  var SELECTOR_EXPANDABLE_BODY = '.expandable-body';
  var SELECTOR_DATA_TOGGLE$2 = '[data-widget="expandable-table"]';
  var SELECTOR_ARIA_ATTR = 'aria-expanded';
  /**
    * Class Definition
    * ====================================================
    */

  var ExpandableTable = /*#__PURE__*/function () {
    function ExpandableTable(element, options) {
      this._options = options;
      this._element = element;
    } // Public


    var _proto = ExpandableTable.prototype;

    _proto.init = function init() {
      $__default['default'](SELECTOR_DATA_TOGGLE$2).each(function (_, $header) {
        var $type = $__default['default']($header).attr(SELECTOR_ARIA_ATTR);
        var $body = $__default['default']($header).next(SELECTOR_EXPANDABLE_BODY).children().first().children();

        if ($type === 'true') {
          $body.show();
        } else if ($type === 'false') {
          $body.hide();
          $body.parent().parent().addClass('d-none');
        }
      });
    };

    _proto.toggleRow = function toggleRow() {
      var $element = this._element;
      var time = 500;
      var $type = $element.attr(SELECTOR_ARIA_ATTR);
      var $body = $element.next(SELECTOR_EXPANDABLE_BODY).children().first().children();
      $body.stop();

      if ($type === 'true') {
        $body.slideUp(time, function () {
          $element.next(SELECTOR_EXPANDABLE_BODY).addClass('d-none');
        });
        $element.attr(SELECTOR_ARIA_ATTR, 'false');
        $element.trigger($__default['default'].Event(EVENT_COLLAPSED$2));
      } else if ($type === 'false') {
        $element.next(SELECTOR_EXPANDABLE_BODY).removeClass('d-none');
        $body.slideDown(time);
        $element.attr(SELECTOR_ARIA_ATTR, 'true');
        $element.trigger($__default['default'].Event(EVENT_EXPANDED$1));
      }
    } // Static
    ;

    ExpandableTable._jQueryInterface = function _jQueryInterface(operation) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$9);

        if (!data) {
          data = new ExpandableTable($__default['default'](this));
          $__default['default'](this).data(DATA_KEY$9, data);
        }

        if (typeof operation === 'string' && /init|toggleRow/.test(operation)) {
          data[operation]();
        }
      });
    };

    return ExpandableTable;
  }();
  /**
    * Data API
    * ====================================================
    */


  $__default['default'](SELECTOR_TABLE).ready(function () {
    ExpandableTable._jQueryInterface.call($__default['default'](this), 'init');
  });
  $__default['default'](document).on('click', SELECTOR_DATA_TOGGLE$2, function () {
    ExpandableTable._jQueryInterface.call($__default['default'](this), 'toggleRow');
  });
  /**
    * jQuery API
    * ====================================================
    */

  $__default['default'].fn[NAME$9] = ExpandableTable._jQueryInterface;
  $__default['default'].fn[NAME$9].Constructor = ExpandableTable;

  $__default['default'].fn[NAME$9].noConflict = function () {
    $__default['default'].fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return ExpandableTable._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Fullscreen.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$8 = 'Fullscreen';
  var DATA_KEY$8 = 'lte.fullscreen';
  var JQUERY_NO_CONFLICT$8 = $__default['default'].fn[NAME$8];
  var SELECTOR_DATA_WIDGET$2 = '[data-widget="fullscreen"]';
  var SELECTOR_ICON = SELECTOR_DATA_WIDGET$2 + " i";
  var Default$8 = {
    minimizeIcon: 'fa-compress-arrows-alt',
    maximizeIcon: 'fa-expand-arrows-alt'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Fullscreen = /*#__PURE__*/function () {
    function Fullscreen(_element, _options) {
      this.element = _element;
      this.options = $__default['default'].extend({}, Default$8, _options);
    } // Public


    var _proto = Fullscreen.prototype;

    _proto.toggle = function toggle() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        this.windowed();
      } else {
        this.fullscreen();
      }
    };

    _proto.fullscreen = function fullscreen() {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }

      $__default['default'](SELECTOR_ICON).removeClass(this.options.maximizeIcon).addClass(this.options.minimizeIcon);
    };

    _proto.windowed = function windowed() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      $__default['default'](SELECTOR_ICON).removeClass(this.options.minimizeIcon).addClass(this.options.maximizeIcon);
    } // Static
    ;

    Fullscreen._jQueryInterface = function _jQueryInterface(config) {
      var data = $__default['default'](this).data(DATA_KEY$8);

      if (!data) {
        data = $__default['default'](this).data();
      }

      var _options = $__default['default'].extend({}, Default$8, typeof config === 'object' ? config : data);

      var plugin = new Fullscreen($__default['default'](this), _options);
      $__default['default'](this).data(DATA_KEY$8, typeof config === 'object' ? config : data);

      if (typeof config === 'string' && /toggle|fullscreen|windowed/.test(config)) {
        plugin[config]();
      } else {
        plugin.init();
      }
    };

    return Fullscreen;
  }();
  /**
    * Data API
    * ====================================================
    */


  $__default['default'](document).on('click', SELECTOR_DATA_WIDGET$2, function () {
    Fullscreen._jQueryInterface.call($__default['default'](this), 'toggle');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$8] = Fullscreen._jQueryInterface;
  $__default['default'].fn[NAME$8].Constructor = Fullscreen;

  $__default['default'].fn[NAME$8].noConflict = function () {
    $__default['default'].fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return Fullscreen._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE IFrame.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$7 = 'IFrame';
  var DATA_KEY$7 = 'lte.iframe';
  var JQUERY_NO_CONFLICT$7 = $__default['default'].fn[NAME$7];
  var SELECTOR_DATA_TOGGLE$1 = '[data-widget="iframe"]';
  var SELECTOR_DATA_TOGGLE_CLOSE = '[data-widget="iframe-close"]';
  var SELECTOR_DATA_TOGGLE_SCROLL_LEFT = '[data-widget="iframe-scrollleft"]';
  var SELECTOR_DATA_TOGGLE_SCROLL_RIGHT = '[data-widget="iframe-scrollright"]';
  var SELECTOR_DATA_TOGGLE_FULLSCREEN = '[data-widget="iframe-fullscreen"]';
  var SELECTOR_CONTENT_WRAPPER = '.content-wrapper';
  var SELECTOR_CONTENT_IFRAME = SELECTOR_CONTENT_WRAPPER + " iframe";
  var SELECTOR_TAB_NAV = SELECTOR_DATA_TOGGLE$1 + ".iframe-mode .nav";
  var SELECTOR_TAB_NAVBAR_NAV = SELECTOR_DATA_TOGGLE$1 + ".iframe-mode .navbar-nav";
  var SELECTOR_TAB_NAVBAR_NAV_ITEM = SELECTOR_TAB_NAVBAR_NAV + " .nav-item";
  var SELECTOR_TAB_NAVBAR_NAV_LINK = SELECTOR_TAB_NAVBAR_NAV + " .nav-link";
  var SELECTOR_TAB_CONTENT = SELECTOR_DATA_TOGGLE$1 + ".iframe-mode .tab-content";
  var SELECTOR_TAB_EMPTY = SELECTOR_TAB_CONTENT + " .tab-empty";
  var SELECTOR_TAB_LOADING = SELECTOR_TAB_CONTENT + " .tab-loading";
  var SELECTOR_TAB_PANE = SELECTOR_TAB_CONTENT + " .tab-pane";
  var SELECTOR_SIDEBAR_MENU_ITEM = '.main-sidebar .nav-item > a.nav-link';
  var SELECTOR_SIDEBAR_SEARCH_ITEM = '.sidebar-search-results .list-group-item';
  var SELECTOR_HEADER_MENU_ITEM = '.main-header .nav-item a.nav-link';
  var SELECTOR_HEADER_DROPDOWN_ITEM = '.main-header a.dropdown-item';
  var CLASS_NAME_IFRAME_MODE = 'iframe-mode';
  var CLASS_NAME_FULLSCREEN_MODE = 'iframe-mode-fullscreen';
  var Default$7 = {
    onTabClick: function onTabClick(item) {
      return item;
    },
    onTabChanged: function onTabChanged(item) {
      return item;
    },
    onTabCreated: function onTabCreated(item) {
      return item;
    },
    autoIframeMode: true,
    autoItemActive: true,
    autoShowNewTab: true,
    allowDuplicates: false,
    loadingScreen: true,
    useNavbarItems: true,
    scrollOffset: 40,
    scrollBehaviorSwap: false,
    iconMaximize: 'fa-expand',
    iconMinimize: 'fa-compress'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var IFrame = /*#__PURE__*/function () {
    function IFrame(element, config) {
      this._config = config;
      this._element = element;

      this._init();
    } // Public


    var _proto = IFrame.prototype;

    _proto.onTabClick = function onTabClick(item) {
      this._config.onTabClick(item);
    };

    _proto.onTabChanged = function onTabChanged(item) {
      this._config.onTabChanged(item);
    };

    _proto.onTabCreated = function onTabCreated(item) {
      this._config.onTabCreated(item);
    };

    _proto.createTab = function createTab(title, link, uniqueName, autoOpen) {
      var _this = this;

      var tabId = "panel-" + uniqueName;
      var navId = "tab-" + uniqueName;

      if (this._config.allowDuplicates) {
        tabId += "-" + Math.floor(Math.random() * 1000);
        navId += "-" + Math.floor(Math.random() * 1000);
      }

      var newNavItem = "<li class=\"nav-item\" role=\"presentation\"><a href=\"#\" class=\"btn-iframe-close\" data-widget=\"iframe-close\" data-type=\"only-this\"><i class=\"fas fa-times\"></i></a><a class=\"nav-link\" data-toggle=\"row\" id=\"" + navId + "\" href=\"#" + tabId + "\" role=\"tab\" aria-controls=\"" + tabId + "\" aria-selected=\"false\">" + title + "</a></li>";
      $__default['default'](SELECTOR_TAB_NAVBAR_NAV).append(unescape(escape(newNavItem)));
      var newTabItem = "<div class=\"tab-pane fade\" id=\"" + tabId + "\" role=\"tabpanel\" aria-labelledby=\"" + navId + "\"><iframe src=\"" + link + "\"></iframe></div>";
      $__default['default'](SELECTOR_TAB_CONTENT).append(unescape(escape(newTabItem)));

      if (autoOpen) {
        if (this._config.loadingScreen) {
          var $loadingScreen = $__default['default'](SELECTOR_TAB_LOADING);
          $loadingScreen.fadeIn();
          $__default['default'](tabId + " iframe").ready(function () {
            if (typeof _this._config.loadingScreen === 'number') {
              _this.switchTab("#" + navId);

              setTimeout(function () {
                $loadingScreen.fadeOut();
              }, _this._config.loadingScreen);
            } else {
              _this.switchTab("#" + navId);

              $loadingScreen.fadeOut();
            }
          });
        } else {
          this.switchTab("#" + navId);
        }
      }

      this.onTabCreated($__default['default']("#" + navId));
    };

    _proto.openTabSidebar = function openTabSidebar(item, autoOpen) {
      if (autoOpen === void 0) {
        autoOpen = this._config.autoShowNewTab;
      }

      var $item = $__default['default'](item).clone();

      if ($item.attr('href') === undefined) {
        $item = $__default['default'](item).parent('a').clone();
      }

      $item.find('.right, .search-path').remove();
      var title = $item.find('p').text();

      if (title === '') {
        title = $item.text();
      }

      var link = $item.attr('href');

      if (link === '#' || link === '' || link === undefined) {
        return;
      }

      var uniqueName = link.replace('./', '').replace(/["&'./:=?[\]]/gi, '-').replace(/(--)/gi, '');
      var navId = "tab-" + uniqueName;

      if (!this._config.allowDuplicates && $__default['default']("#" + navId).length > 0) {
        return this.switchTab("#" + navId);
      }

      if (!this._config.allowDuplicates && $__default['default']("#" + navId).length === 0 || this._config.allowDuplicates) {
        this.createTab(title, link, uniqueName, autoOpen);
      }
    };

    _proto.switchTab = function switchTab(item) {
      var $item = $__default['default'](item);
      var tabId = $item.attr('href');
      $__default['default'](SELECTOR_TAB_EMPTY).hide();
      $__default['default'](SELECTOR_TAB_NAVBAR_NAV + " .active").tab('dispose').removeClass('active');

      this._fixHeight();

      $item.tab('show');
      $item.parents('li').addClass('active');
      this.onTabChanged($item);

      if (this._config.autoItemActive) {
        this._setItemActive($__default['default'](tabId + " iframe").attr('src'));
      }
    };

    _proto.removeActiveTab = function removeActiveTab(type, element) {
      if (type == 'all') {
        $__default['default'](SELECTOR_TAB_NAVBAR_NAV_ITEM).remove();
        $__default['default'](SELECTOR_TAB_PANE).remove();
        $__default['default'](SELECTOR_TAB_EMPTY).show();
      } else if (type == 'all-other') {
        $__default['default'](SELECTOR_TAB_NAVBAR_NAV_ITEM + ":not(.active)").remove();
        $__default['default'](SELECTOR_TAB_PANE + ":not(.active)").remove();
      } else if (type == 'only-this') {
        var $navClose = $__default['default'](element);
        var $navItem = $navClose.parent('.nav-item');
        var $navItemParent = $navItem.parent();
        var navItemIndex = $navItem.index();
        var tabId = $navClose.siblings('.nav-link').attr('aria-controls');
        $navItem.remove();
        $__default['default']("#" + tabId).remove();

        if ($__default['default'](SELECTOR_TAB_CONTENT).children().length == $__default['default'](SELECTOR_TAB_EMPTY + ", " + SELECTOR_TAB_LOADING).length) {
          $__default['default'](SELECTOR_TAB_EMPTY).show();
        } else {
          var prevNavItemIndex = navItemIndex - 1;
          this.switchTab($navItemParent.children().eq(prevNavItemIndex).find('a.nav-link'));
        }
      } else {
        var _$navItem = $__default['default'](SELECTOR_TAB_NAVBAR_NAV_ITEM + ".active");

        var _$navItemParent = _$navItem.parent();

        var _navItemIndex = _$navItem.index();

        _$navItem.remove();

        $__default['default'](SELECTOR_TAB_PANE + ".active").remove();

        if ($__default['default'](SELECTOR_TAB_CONTENT).children().length == $__default['default'](SELECTOR_TAB_EMPTY + ", " + SELECTOR_TAB_LOADING).length) {
          $__default['default'](SELECTOR_TAB_EMPTY).show();
        } else {
          var _prevNavItemIndex = _navItemIndex - 1;

          this.switchTab(_$navItemParent.children().eq(_prevNavItemIndex).find('a.nav-link'));
        }
      }
    };

    _proto.toggleFullscreen = function toggleFullscreen() {
      if ($__default['default']('body').hasClass(CLASS_NAME_FULLSCREEN_MODE)) {
        $__default['default'](SELECTOR_DATA_TOGGLE_FULLSCREEN + " i").removeClass(this._config.iconMinimize).addClass(this._config.iconMaximize);
        $__default['default']('body').removeClass(CLASS_NAME_FULLSCREEN_MODE);
        $__default['default'](SELECTOR_TAB_EMPTY + ", " + SELECTOR_TAB_LOADING).height('auto');
        $__default['default'](SELECTOR_CONTENT_WRAPPER).height('auto');
        $__default['default'](SELECTOR_CONTENT_IFRAME).height('auto');
      } else {
        $__default['default'](SELECTOR_DATA_TOGGLE_FULLSCREEN + " i").removeClass(this._config.iconMaximize).addClass(this._config.iconMinimize);
        $__default['default']('body').addClass(CLASS_NAME_FULLSCREEN_MODE);
      }

      $__default['default'](window).trigger('resize');

      this._fixHeight(true);
    } // Private
    ;

    _proto._init = function _init() {
      if (window.frameElement && this._config.autoIframeMode) {
        $__default['default']('body').addClass(CLASS_NAME_IFRAME_MODE);
      } else if ($__default['default'](SELECTOR_CONTENT_WRAPPER).hasClass(CLASS_NAME_IFRAME_MODE)) {
        if ($__default['default'](SELECTOR_TAB_CONTENT).children().length > 2) {
          var $el = $__default['default'](SELECTOR_TAB_PANE + ":first-child");
          $el.show();

          this._setItemActive($el.find('iframe').attr('src'));
        }

        this._setupListeners();

        this._fixHeight(true);
      }
    };

    _proto._navScroll = function _navScroll(offset) {
      var leftPos = $__default['default'](SELECTOR_TAB_NAVBAR_NAV).scrollLeft();
      $__default['default'](SELECTOR_TAB_NAVBAR_NAV).animate({
        scrollLeft: leftPos + offset
      }, 250, 'linear');
    };

    _proto._setupListeners = function _setupListeners() {
      var _this2 = this;

      $__default['default'](window).on('resize', function () {
        setTimeout(function () {
          _this2._fixHeight();
        }, 1);
      });
      $__default['default'](document).on('click', SELECTOR_SIDEBAR_MENU_ITEM + ", " + SELECTOR_SIDEBAR_SEARCH_ITEM, function (e) {
        e.preventDefault();

        _this2.openTabSidebar(e.target);
      });

      if (this._config.useNavbarItems) {
        $__default['default'](document).on('click', SELECTOR_HEADER_MENU_ITEM + ", " + SELECTOR_HEADER_DROPDOWN_ITEM, function (e) {
          e.preventDefault();

          _this2.openTabSidebar(e.target);
        });
      }

      $__default['default'](document).on('click', SELECTOR_TAB_NAVBAR_NAV_LINK, function (e) {
        e.preventDefault();

        _this2.onTabClick(e.target);

        _this2.switchTab(e.target);
      });
      $__default['default'](document).on('click', SELECTOR_TAB_NAVBAR_NAV_LINK, function (e) {
        e.preventDefault();

        _this2.onTabClick(e.target);

        _this2.switchTab(e.target);
      });
      $__default['default'](document).on('click', SELECTOR_DATA_TOGGLE_CLOSE, function (e) {
        e.preventDefault();
        var target = e.target;

        if (target.nodeName == 'I') {
          target = e.target.offsetParent;
        }

        _this2.removeActiveTab(target.attributes['data-type'] ? target.attributes['data-type'].nodeValue : null, target);
      });
      $__default['default'](document).on('click', SELECTOR_DATA_TOGGLE_FULLSCREEN, function (e) {
        e.preventDefault();

        _this2.toggleFullscreen();
      });
      var mousedown = false;
      var mousedownInterval = null;
      $__default['default'](document).on('mousedown', SELECTOR_DATA_TOGGLE_SCROLL_LEFT, function (e) {
        e.preventDefault();
        clearInterval(mousedownInterval);
        var scrollOffset = _this2._config.scrollOffset;

        if (!_this2._config.scrollBehaviorSwap) {
          scrollOffset = -scrollOffset;
        }

        mousedown = true;

        _this2._navScroll(scrollOffset);

        mousedownInterval = setInterval(function () {
          _this2._navScroll(scrollOffset);
        }, 250);
      });
      $__default['default'](document).on('mousedown', SELECTOR_DATA_TOGGLE_SCROLL_RIGHT, function (e) {
        e.preventDefault();
        clearInterval(mousedownInterval);
        var scrollOffset = _this2._config.scrollOffset;

        if (_this2._config.scrollBehaviorSwap) {
          scrollOffset = -scrollOffset;
        }

        mousedown = true;

        _this2._navScroll(scrollOffset);

        mousedownInterval = setInterval(function () {
          _this2._navScroll(scrollOffset);
        }, 250);
      });
      $__default['default'](document).on('mouseup', function () {
        if (mousedown) {
          mousedown = false;
          clearInterval(mousedownInterval);
          mousedownInterval = null;
        }
      });
    };

    _proto._setItemActive = function _setItemActive(href) {
      $__default['default'](SELECTOR_SIDEBAR_MENU_ITEM + ", " + SELECTOR_HEADER_DROPDOWN_ITEM).removeClass('active');
      $__default['default'](SELECTOR_HEADER_MENU_ITEM).parent().removeClass('active');
      var $headerMenuItem = $__default['default'](SELECTOR_HEADER_MENU_ITEM + "[href$=\"" + href + "\"]");
      var $headerDropdownItem = $__default['default'](SELECTOR_HEADER_DROPDOWN_ITEM + "[href$=\"" + href + "\"]");
      var $sidebarMenuItem = $__default['default'](SELECTOR_SIDEBAR_MENU_ITEM + "[href$=\"" + href + "\"]");
      $headerMenuItem.each(function (i, e) {
        $__default['default'](e).parent().addClass('active');
      });
      $headerDropdownItem.each(function (i, e) {
        $__default['default'](e).addClass('active');
      });
      $sidebarMenuItem.each(function (i, e) {
        $__default['default'](e).addClass('active');
        $__default['default'](e).parents('.nav-treeview').prevAll('.nav-link').addClass('active');
      });
    };

    _proto._fixHeight = function _fixHeight(tabEmpty) {
      if (tabEmpty === void 0) {
        tabEmpty = false;
      }

      if ($__default['default']('body').hasClass(CLASS_NAME_FULLSCREEN_MODE)) {
        var windowHeight = $__default['default'](window).height();
        var navbarHeight = $__default['default'](SELECTOR_TAB_NAV).outerHeight();
        $__default['default'](SELECTOR_TAB_EMPTY + ", " + SELECTOR_TAB_LOADING + ", " + SELECTOR_CONTENT_IFRAME).height(windowHeight - navbarHeight);
        $__default['default'](SELECTOR_CONTENT_WRAPPER).height(windowHeight);
      } else {
        var contentWrapperHeight = parseFloat($__default['default'](SELECTOR_CONTENT_WRAPPER).css('height'));

        var _navbarHeight = $__default['default'](SELECTOR_TAB_NAV).outerHeight();

        if (tabEmpty == true) {
          setTimeout(function () {
            $__default['default'](SELECTOR_TAB_EMPTY + ", " + SELECTOR_TAB_LOADING).height(contentWrapperHeight - _navbarHeight);
          }, 50);
        } else {
          $__default['default'](SELECTOR_CONTENT_IFRAME).height(contentWrapperHeight - _navbarHeight);
        }
      }
    } // Static
    ;

    IFrame._jQueryInterface = function _jQueryInterface(operation) {
      var data = $__default['default'](this).data(DATA_KEY$7);

      var _options = $__default['default'].extend({}, Default$7, $__default['default'](this).data());

      if (!data) {
        data = new IFrame(this, _options);
        $__default['default'](this).data(DATA_KEY$7, data);
      }

      if (typeof operation === 'string' && /createTab|openTabSidebar|switchTab|removeActiveTab/.test(operation)) {
        var _data;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_data = data)[operation].apply(_data, args);
      }
    };

    return IFrame;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](window).on('load', function () {
    IFrame._jQueryInterface.call($__default['default'](SELECTOR_DATA_TOGGLE$1));
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$7] = IFrame._jQueryInterface;
  $__default['default'].fn[NAME$7].Constructor = IFrame;

  $__default['default'].fn[NAME$7].noConflict = function () {
    $__default['default'].fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return IFrame._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Layout.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$6 = 'Layout';
  var DATA_KEY$6 = 'lte.layout';
  var JQUERY_NO_CONFLICT$6 = $__default['default'].fn[NAME$6];
  var SELECTOR_HEADER = '.main-header';
  var SELECTOR_MAIN_SIDEBAR = '.main-sidebar';
  var SELECTOR_SIDEBAR$1 = '.main-sidebar .sidebar';
  var SELECTOR_CONTENT = '.content-wrapper';
  var SELECTOR_CONTROL_SIDEBAR_CONTENT = '.control-sidebar-content';
  var SELECTOR_CONTROL_SIDEBAR_BTN = '[data-widget="control-sidebar"]';
  var SELECTOR_FOOTER = '.main-footer';
  var SELECTOR_PUSHMENU_BTN = '[data-widget="pushmenu"]';
  var SELECTOR_LOGIN_BOX = '.login-box';
  var SELECTOR_REGISTER_BOX = '.register-box';
  var SELECTOR_PRELOADER = '.preloader';
  var CLASS_NAME_SIDEBAR_COLLAPSED$1 = 'sidebar-collapse';
  var CLASS_NAME_SIDEBAR_FOCUSED = 'sidebar-focused';
  var CLASS_NAME_LAYOUT_FIXED = 'layout-fixed';
  var CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN = 'control-sidebar-slide-open';
  var CLASS_NAME_CONTROL_SIDEBAR_OPEN = 'control-sidebar-open';
  var Default$6 = {
    scrollbarTheme: 'os-theme-light',
    scrollbarAutoHide: 'l',
    panelAutoHeight: true,
    panelAutoHeightMode: 'min-height',
    preloadDuration: 200,
    loginRegisterAutoHeight: true
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Layout = /*#__PURE__*/function () {
    function Layout(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Layout.prototype;

    _proto.fixLayoutHeight = function fixLayoutHeight(extra) {
      if (extra === void 0) {
        extra = null;
      }

      var $body = $__default['default']('body');
      var controlSidebar = 0;

      if ($body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_SLIDE_OPEN) || $body.hasClass(CLASS_NAME_CONTROL_SIDEBAR_OPEN) || extra === 'control_sidebar') {
        controlSidebar = $__default['default'](SELECTOR_CONTROL_SIDEBAR_CONTENT).outerHeight();
      }

      var heights = {
        window: $__default['default'](window).height(),
        header: $__default['default'](SELECTOR_HEADER).length > 0 ? $__default['default'](SELECTOR_HEADER).outerHeight() : 0,
        footer: $__default['default'](SELECTOR_FOOTER).length > 0 ? $__default['default'](SELECTOR_FOOTER).outerHeight() : 0,
        sidebar: $__default['default'](SELECTOR_SIDEBAR$1).length > 0 ? $__default['default'](SELECTOR_SIDEBAR$1).height() : 0,
        controlSidebar: controlSidebar
      };

      var max = this._max(heights);

      var offset = this._config.panelAutoHeight;

      if (offset === true) {
        offset = 0;
      }

      var $contentSelector = $__default['default'](SELECTOR_CONTENT);

      if (offset !== false) {
        if (max === heights.controlSidebar) {
          $contentSelector.css(this._config.panelAutoHeightMode, max + offset);
        } else if (max === heights.window) {
          $contentSelector.css(this._config.panelAutoHeightMode, max + offset - heights.header - heights.footer);
        } else {
          $contentSelector.css(this._config.panelAutoHeightMode, max + offset - heights.header);
        }

        if (this._isFooterFixed()) {
          $contentSelector.css(this._config.panelAutoHeightMode, parseFloat($contentSelector.css(this._config.panelAutoHeightMode)) + heights.footer);
        }
      }

      if (!$body.hasClass(CLASS_NAME_LAYOUT_FIXED)) {
        return;
      }

      if (typeof $__default['default'].fn.overlayScrollbars !== 'undefined') {
        $__default['default'](SELECTOR_SIDEBAR$1).overlayScrollbars({
          className: this._config.scrollbarTheme,
          sizeAutoCapable: true,
          scrollbars: {
            autoHide: this._config.scrollbarAutoHide,
            clickScrolling: true
          }
        });
      } else {
        $__default['default'](SELECTOR_SIDEBAR$1).css('overflow-y', 'auto');
      }
    };

    _proto.fixLoginRegisterHeight = function fixLoginRegisterHeight() {
      var $body = $__default['default']('body');
      var $selector = $__default['default'](SELECTOR_LOGIN_BOX + ", " + SELECTOR_REGISTER_BOX);

      if ($selector.length === 0) {
        $body.css('height', 'auto');
        $__default['default']('html').css('height', 'auto');
      } else {
        var boxHeight = $selector.height();

        if ($body.css(this._config.panelAutoHeightMode) !== boxHeight) {
          $body.css(this._config.panelAutoHeightMode, boxHeight);
        }
      }
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      // Activate layout height watcher
      this.fixLayoutHeight();

      if (this._config.loginRegisterAutoHeight === true) {
        this.fixLoginRegisterHeight();
      } else if (this._config.loginRegisterAutoHeight === parseInt(this._config.loginRegisterAutoHeight, 10)) {
        setInterval(this.fixLoginRegisterHeight, this._config.loginRegisterAutoHeight);
      }

      $__default['default'](SELECTOR_SIDEBAR$1).on('collapsed.lte.treeview expanded.lte.treeview', function () {
        _this.fixLayoutHeight();
      });
      $__default['default'](SELECTOR_MAIN_SIDEBAR).on('mouseenter mouseleave', function () {
        if ($__default['default']('body').hasClass(CLASS_NAME_SIDEBAR_COLLAPSED$1)) {
          _this.fixLayoutHeight();
        }
      });
      $__default['default'](SELECTOR_PUSHMENU_BTN).on('collapsed.lte.pushmenu shown.lte.pushmenu', function () {
        setTimeout(function () {
          _this.fixLayoutHeight();
        }, 300);
      });
      $__default['default'](SELECTOR_CONTROL_SIDEBAR_BTN).on('collapsed.lte.controlsidebar', function () {
        _this.fixLayoutHeight();
      }).on('expanded.lte.controlsidebar', function () {
        _this.fixLayoutHeight('control_sidebar');
      });
      $__default['default'](window).resize(function () {
        _this.fixLayoutHeight();
      });
      setTimeout(function () {
        $__default['default']('body.hold-transition').removeClass('hold-transition');
      }, 50);
      setTimeout(function () {
        var $preloader = $__default['default'](SELECTOR_PRELOADER);

        if ($preloader) {
          $preloader.css('height', 0);
          setTimeout(function () {
            $preloader.children().hide();
          }, 200);
        }
      }, this._config.preloadDuration);
    };

    _proto._max = function _max(numbers) {
      // Calculate the maximum number in a list
      var max = 0;
      Object.keys(numbers).forEach(function (key) {
        if (numbers[key] > max) {
          max = numbers[key];
        }
      });
      return max;
    };

    _proto._isFooterFixed = function _isFooterFixed() {
      return $__default['default'](SELECTOR_FOOTER).css('position') === 'fixed';
    } // Static
    ;

    Layout._jQueryInterface = function _jQueryInterface(config) {
      if (config === void 0) {
        config = '';
      }

      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$6);

        var _options = $__default['default'].extend({}, Default$6, $__default['default'](this).data());

        if (!data) {
          data = new Layout($__default['default'](this), _options);
          $__default['default'](this).data(DATA_KEY$6, data);
        }

        if (config === 'init' || config === '') {
          data._init();
        } else if (config === 'fixLayoutHeight' || config === 'fixLoginRegisterHeight') {
          data[config]();
        }
      });
    };

    return Layout;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](window).on('load', function () {
    Layout._jQueryInterface.call($__default['default']('body'));
  });
  $__default['default'](SELECTOR_SIDEBAR$1 + " a").on('focusin', function () {
    $__default['default'](SELECTOR_MAIN_SIDEBAR).addClass(CLASS_NAME_SIDEBAR_FOCUSED);
  }).on('focusout', function () {
    $__default['default'](SELECTOR_MAIN_SIDEBAR).removeClass(CLASS_NAME_SIDEBAR_FOCUSED);
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$6] = Layout._jQueryInterface;
  $__default['default'].fn[NAME$6].Constructor = Layout;

  $__default['default'].fn[NAME$6].noConflict = function () {
    $__default['default'].fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Layout._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE PushMenu.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$5 = 'PushMenu';
  var DATA_KEY$5 = 'lte.pushmenu';
  var EVENT_KEY$2 = "." + DATA_KEY$5;
  var JQUERY_NO_CONFLICT$5 = $__default['default'].fn[NAME$5];
  var EVENT_COLLAPSED$1 = "collapsed" + EVENT_KEY$2;
  var EVENT_SHOWN = "shown" + EVENT_KEY$2;
  var SELECTOR_TOGGLE_BUTTON$1 = '[data-widget="pushmenu"]';
  var SELECTOR_BODY = 'body';
  var SELECTOR_OVERLAY = '#sidebar-overlay';
  var SELECTOR_WRAPPER = '.wrapper';
  var CLASS_NAME_COLLAPSED = 'sidebar-collapse';
  var CLASS_NAME_OPEN$3 = 'sidebar-open';
  var CLASS_NAME_IS_OPENING$1 = 'sidebar-is-opening';
  var CLASS_NAME_CLOSED = 'sidebar-closed';
  var Default$5 = {
    autoCollapseSize: 992,
    enableRemember: false,
    noTransitionAfterReload: true
  };
  /**
   * Class Definition
   * ====================================================
   */

  var PushMenu = /*#__PURE__*/function () {
    function PushMenu(element, options) {
      this._element = element;
      this._options = $__default['default'].extend({}, Default$5, options);

      if ($__default['default'](SELECTOR_OVERLAY).length === 0) {
        this._addOverlay();
      }
 $    this._knit();    } // Public


    rar _proto = PushMenu.protntype;

    _prmto.å|tand =(funcpion expanU()!{ `!  &var $bodySelector!? $__tefault[gdefault'](SÅLeCTOR_BODY)»

      if (ìhis&_opd)onq.aõtoCohlipseSizd && $__default['default'](winDow).widti() <= this.[kption3.aõtoCOllarseSize)({
     "  $bodySemec|or.af¤Class(CLASS_NAME_OPEN$3);
  "(  }

   " ($bodySeîector.addClass(CLASS[FAME_IS_OÐENING$1).zmmoveClass(ALASS_NAME_CNNLAPSED  " " + CLASS[NA]E_CNOSED).delay(50).quEue(FunctioN () {
        $bodySelEctor.removeCmass(CLASS_NAME_IS_OPENING$1)s
        $__defa5lt['fefault'](this).deaueue();
      });
      if (phis._options.enableRemember) {   `    local[torage.setItem("rememfer" + AVENT_KEY$2. CLASS_NAME_ÏPEO$3);
   `  }

      $__default[gdebauìt'](this._eleeent).trigger($__default['default'].Åve~t(EVENT_SHOWÎ))
`   };

    _0roto.aolhapse = function"cdlapseh) {
      var!,bodyseecô/r = $__deæatlt['default'](RELECTOZ_BODy);
      ág  tiis._options.autoollqpseSire && $__dEfault['default'](windnw/.wifth()0<=`|his._optioîsnautoAjmapreSize)!{
    @   $bodySelecuor.removeClass(CLÁSS_NEMA_OPEN$3).addClaós(CLASS_NAME_CLOSEL);
b     }
J      $bodySelector®adfClass(CLASS_JAME_COLLAPED);*
      if ,t`is._optmons.encbleRememjer) {
        |o{alStoòMge.se4Item("remember" ) EVENT_KUY$2, CLQSS_NAME_COLL@PSED);
  0   }

 (    $__default[7default'](thhs._element).vriggmr($__degault['defauìt'].Event(EVENTOCOLMÑPSED1));
    };
    _proto.toggle = gunction togole() {  !   iv(($__default['default'](sGLECTOR_ODY).hasClass(BLSSNAME_COLDAPSED)) {
        thiw&expnd();
      } el3e {
        this>cn|lapseh);
$     }
    };

    _proto.autoCollatse 5 function autnCollapsehresize) {      kf (rerize --= woid$0) {
 `   `  resize = false;
  `   }
      if (!phis.Ooptiofs.qutoColl!pseSize) {
   ($ ! retupn;
      }

      var $bod{SElEcvoR = $_]d%bcult['default'_(SELEKToV_BODY){

   "  if ($_Wdefault['defaqlt'](win`oWi.width() <= thi3._options.autnCollapseSihe) {
    ¨   if#(#$bo$ySelector.hasClass(ALASS_NAMEßOPEN$3)) {
" `   "   this.gollapse();
        }
      } ense if (resizg === tzue) {Š (   (  if ($body[elactor.hasnass(CLASs_NAOE_OPE~$3-) {
       0  $bmdySelector.reímveClasc(CLA“_ÎAME_OPEH$3);
 #      } else if 8,bodySeleator.è!sClass(CLASG_NAME_CLOSMD)) {
      0   thisnexpand(!;
    0   
      }
`   };

 0  oproto(zemembår = function òemember()€{      if (!thi{._í`tionó.ena"leremember) {
     !  returo;
  "   }
   °  var $body ? $__`efault[§dåfaul4']('body'©;  `   var toggletate = loãelStorage.getItem("remember" + EVEHT_KEY$6);

 @    if (toggleSta|e =¼= CNASS_NAME_COLLAPS…D9 {
    $   if$(thzs._options.noTransidiïnAvterReLoad) {
      !   $body,addClass('hold­tranóition'+>addClass(CLASS_NAME_COLLAPWED)delay(50).qweue(function () {
      $ `   $_Odefault['default%],this).p%moveClass('hGld-transition');
    "  `    $__ddfault['dencult'M(thiq).dequmue();
     `    m);
      ¡ } else {
          $body.addClass(CLASSßNAMECOLLÁPSED+;
!       }
  !   }!else id (thi3®_options.noTrcnsitiïîAfterRåload) {
        $bofy.addClass('hold-Transipéon'+.removeClacs(CLASS_NAME_COLLAPSED).delay(50).queue(function ) {
          $__deæaulô['dåfault'](tèis).removeClass('`old-transition');
      `   $__default[§defeult'](this).`equeue¨);J    0 ( });
    & } else {
   $    $body.remo~eClass(CLASS_NAME_COLLAPSED);   à  }
    } // Private
    ;

(  ¡_protn._iîit = fqnction _iniu() {
      var$_this = this;

      this.rememb%r();(     this.autoCollapse();      $__tefaul4[Odefault'(window).r%si{e(funktion ,) {
        _thiw.!utoCollapseèôrue);
      });
 $  };

    _proto._addOverlay = functjoN _addOperlay() {
      var _thms² = 4his;

      var OVerlay = $_defaölt['defaulv']('<div />'< {
      " il: 'Sidqbar-overìay'
      });
     !overlay>on(&3licj', function ()!{
        _this2.#ollapse*);
 `    });
     0_default['dufatlt'](SEŒGCT_R_WRAPÐER).append)iverlay);
    } // Static
    ;

    PushMene._jQudry	lterfaca = functe/n _jQueryÉntdrface(operation) {
    $!return this.each(funcuion () {
 $     vár tata = $__default['defatlt'](this).dau@(DATA_KEY$5);

        var _options(= $__default['default'].extmnd({}, Äegault$5, $__debault['denculu'}(this).data());

        if (!d!ôa) {
         !data 5 new PushMenu(txis, _optéons);
 "        $__defaultS'default'M(this).data(DCTA_KEY$5, data);
        }
        éf htypeOf operation === gstring' && /bo|lapse|expcnd|ôoggle/.teut(operadion-i {
       !  data[opeRation](-;
        ý
      });
    y+

    return PushMenu;
  e();
  /**
   *$Eata API
   * ==-===============¹=========5===)==½====9=<======?}
   */


  $__defau,t['default'](eocument).On8'clic[', SELECTOR_DOGGLE_BUDTON$1, func|ion (evMnt) {
    evEot.0rev%ntDefáult();
    var butpn = åvent.curre~tTarget;

    iv ($__default[§fefaulp'](button).data('whdget') !== 'pushienu') {Š      jutton 9 $__¤efault['default§]8bqtton).closåst(SELECTOR_TOGGLE_BUTTOL$1);
    }

    PushMenu._jQueryInterface.CcLl $__default[#dedaqlt'[(butpon), 'togGle');
  m+;
  $__lefaultÛdefaultg](window+.on('load', f5nctaon () {
    PushManu/_jQueryInterfice.cAll($_[default['default'](SELMCTMR_TOGGLE_bUTTMN$1));J  });
  /**
   * jQuery`AI
 ( *"==½½====-==========-=====-=====¿====½===9}=========
   Ê/

  $_defaudt['default']nfn[NAME$5] -0PushMejw._jQueryÉnterface;
  $__default[§deFqult'].f~[NAME$5].Ãonwt2uctor = PushMene;

  $__defaul4['d¥fault'].fn[NAME$u\.noCofflict = function () z
 $  $__defaultS'default'].fnkOAME$5] = JQUERY_NW_CONFLICT5;
    reôurn XushUene._jQueryIlterfice;
  };

  /**
   j ---/----------­-----------/----­----­----- " * AdminLTE Sidebarsearch.hs
   . License MIT
   * m----------=--------%-----%-----------%--,--
   */
  /**
   * Constaots
   * ;=}========<<===========?=======½=====9====9========
  #*?

$ var NAMEd4 } 'WidecarSearch';
  rar DATA_KEY$40= 'lte.sidebar-se!rch';
 $var JQUERY_NO_CONFLICT$4 < $__defaulT['defcel|'].fnKNAME$4];  var CLSS_NAIE_MPEN$2 - 'sidebar-rear#h-open';
" var CDASS_OAME_YCÏN_SEARCH = 'fa-sgarch'
  zar CLASS_NAME_ICON_CJOSE = §æa-times'
  var CLASS_NAME_HEADEZ = 'naw-hea$er';
  var CLASSNaME_CEARCH_SSUDTs  'sidebar-search-resulds';
  vcr CLASS_NAMELICT_GROUP = 'list-greUP';
( var SELEKTOR_DA\E_WIDGET$1 =8'[datamWidget="sidebar-searc`"]'»
  var _eLECTOr_SIPEBAR = '.maiN-sidebar .nar-sideBar';
  var`SULECTOR[NAV_TINK ¼ '.Îav-link';
  var SELUCTÏR_NAF_UREEVIEW!= '.nav-treeview';
  Var SELECTOR_SEARCH_INQUT$1 = SELECTOB_DTA_WIDGET$1 + " .form-cntRoh";
  var SELDCTOR_SEARCHßBUTTKN = SELECTORßDATA_WIDGET$1 + " .btn";Š  var SELECTOr[SEARCHWICO = SELECTOR_SEARCH_BUTTON +$! i";
  var SEMC$R_SEARCH_LIST_GROUP = "." + CLASP?NAME_LIST_GROuP;Š (var SELECTO’_CE@BCI_RESULS = "6" + CLASC_NAMD_SEARCH_RESULTS;
 $var$SMLECTOR_SEAPCH_RESULTS_GROUP = LECTOR_SEAZCH_ReSULTS + "0." + GLAWS_NAmE_LIWT_GROUP;
( var Default$4 ? {
    arbosSignz '->',
    minLength: 3,
  " maxResults: 7,   high|ightName: true<    highlightPath: false¼
   0highlifhtCOess: 'uexw-ligèt#,
    notFg}ndText: 'No eLement fiund#'
` };
  var Wå`pchItåms8= [];0 /*:
  j Claqs efhnytéon
  !* ====½====<=}=======5}============}==========5=======
   :/

0 var SidebarSearch = /*#_]PURE_^*/function () {
  ! function Cideb`rÒearch(_elemend _options) {
      this.element 9 _eìement;j(     uhis.opõions =$$__defsult['degault'].extend({}, Default$4, _options);
      this.items  [];
    } // Pu`lic


   (var [p2oto = SidebarSearch.pr/tot9pe;
    Wproto.init = dunction init() ;J    $ vaR _this = this;

      if ($__default['default'](WELESTOR_DATA_WIDGMT$1+.length ==9 0) {
 $      return;
   0  }

      éf ($__defiuLt['def!elt7](SELECTOR_DATA_WIDGET$1(.next SELECTOR_SEARCH_RASULTS).length === 0) {
 "      $__defeulT['default']¨SELEGTOR_DATA×ITGET$1).aFter(å__deviu,t['dafault']('<div />', {
  "  0    claZs:$CLASS_OAME_SEARCH_PESULTS
  `     }));
   `  }

    " if ($__defaulô['default'}(SELECTOR_SARAH_RUSULTQ9.children(SELECPOB_SAARCH_LIST_GROUP).length === 0)${
 0      $__äefault['defAult']8SELECTOR_SECRCHorESULTS).appendh$__dedault['defeult'] '<dit />', k
,         class: C\ASS_NAMEWLQST_GRLP
        }));
$ 0   }

      this._addNTFound();

    ` $__default['default'],SELECTORWSADEBAR).c`iddrel().Eaah(function (i, child) {Š (      _this._párseIdem(chilt);
 0  0 });
 !  };
!   _proto.searsè = function search*) {
      var _this2 = tiis;

@$ (  var sdarchValue = $_default['defauht']*SELGCTOR_ÓEARCH_INPUT$1)>val()&tnLowerCase();

      if (seqrchValue*length"> this.ottoons>manLength9 {Š        $Ÿ_defau|v[7default'](SelECTOZ_SEARCH_RESU\TSßGROUP)®empty();

        ph)s._`d`NotFounä();
 (   $  thiS.close();
        return;
      }

      vas seaRchResults = SearchItems.filter(fwnction (item) {
      0 retõrn item>neme.voLcwerCase().i^cludes¨searchValwe);
    ! }9;
  !   var endÒesults = $__defa}lt['default'](searchReóutts*slice(2,!this.options.maxReSults)!;
      ,ß_defaul|'default'],SELECTOR^sEARCH_RESUM|S_GROUP).empty()ë

      ib (endRecumts.length!===  ) {
        this._adDNotFmund();
0     } else {
        åndResults.each(functyon (i, result) {
          $W_defaultZ'dudaelt'](3ELECTOR_SEARCH_REQulTS_EROUP).appeNd(_qhis2._renderItem(escape(resuhu.name(,$escapehresult.mink), resunt.path)!;
     @$ });
      }
*      th)s.ïpen*);
    };

  # _proto.open = function open() {Š     ""__default_#dafault'](SELECTOr_DATA_WIDOEV$1).parent().adä#dasg8CÌAS_JAMEß/PAN$2);
     `$[_defauld['|Efeult'](SELECTOR_SEIRCH_I[ON).removeClass([LASSßOAME_ICON_SEARBH).addClass(BLASS_NAME_ICONWCLNSE);
    };

    _proto.glOse = &unction Close(	 {
      $__default['default'](SELECTOR_DATÁ_WIDGET$1).parent().removeClass(BLASS_NAME_PaN$2);
      $__defAu|t['defaulu](SELECTOZ_CEIRCH_ISON).removeClass(CMÁRS_NAME_HCONWKLOSÅ).addCl!ss(CLAÓS_NAME_ICON_SEARCH);
    }9

    Oproto.tosgje = function toggle,9 {
     Áif$($__default['hefAult'](WElECTOR_DATA_WIDGET$1).paòeît().(asClass(CLCSSŸFAMGWOPEN$r)) {
 !   (  this.close();J      } else {
    "   this.open();
  á 0 }
    { //"Pri6`te
¢   ;
    _proto._pirSeItem = function _parweÉtem(item, pat`) {
      var _this3 = 4his;

     0if (`ath === void 0) s
    !   pauh = [];
      }

      if (d__default['default7](itum-.hasClass(CLASS_LAMEÝHEÁDDR)) {
      ` råturn{
 )    }

"0  ( var itamOdject‚= {};
      var navLink = $__eefault['äåfault'](iteï)>clone().fmjd("> " +!SELECTOÒ_NAV_LINK);
   !$ var na6Treeview = $ß_$edawlô['default'](étdoi.clone().find("> " + SELECTOR_NAV_TREEVIEW);
      var lmnë =)NqrLink.atvr('hbef');*      vir name = navLink.fiNd('p').chkldren().remove().end().teyt();
,     itemOBject.~ame = this._trimTmxt(name);
  `   itemObject.link = lifk;  à   mtemObjecvpath = path;

0`    if (navTraevéew>length }== 0){
        Cearch	tems.push(itemObject);
   " "} else {
 (      var newPa4h = itemM"jåct:xath.concat([itemObêect.nam%-;
      " navTúgeview.chaldren()neqch(fun#tion (i, c`ild) {
 "    `   tlis1._parseIteonchilä- newPath);
      ! });Š      }
    };

    _proto._trimText = function _trimTexp¨text) {
      return $.tril(te|t.replace(/\r\n|\n|\r)/gm, ' '));Š    };

    ^prïto._renderItem ="function"_renderItel(name, nini, path)0
!  $$ var _this4 = this;

      path@= path,joinh" " +$this.options.arrowSign + " ");
      namå$= unescape(name);

      if (this.options&highlightNam% |ü th)s.optiofS.highligjtPath) {
        var(searchValue = $__defaulDS'default'](SULEÃTOR_SEARCH_INÑUÔ$1)®val),toLowerCase();
      0 var"regExp = new RegExx(searchValue, 'g)');

        if ¸this.options.haghnightOame) {
$0 &      name = namä.suplac=(pEwExp, function (3tr {
          @ ðeTurn "<srone cìass=\"" + _this4.ortions.higdlhghtClass +"&\">" + str + ¢</trong>";Š`         }){
        }

        if (ui)s>optmoNP*higllightPath) {  (       paph = path.repLace(reguxp, funbtion (str) {
        (   veturn`"<strong class=\"" + _this4.o0tions&highlightCla{s  "Ü"<" + str$£ "<strong>"3
     `  $ }(+
   !    }
   !  }

      var croupItdmElement  $__defaulv[&default']('<a/>', yJ        href: hiîk,J (      cláss: 'lhst-group-item'
      });
      far0searchTitleE,ement ½ $_Wde&awlt['fefaõÜt']('<dir/>',${
"       c|ass: 'search-tit,e'
      }).hôml(name);
      var searcøÐatlDlement =($__dåfault['default']('<dIv/', {        cma{s: 'secrch-pAth'      }).htm}(Ðcti);
 `    groupItemE|emgnv.append(searchTitleElumenti/arpend(searchPatiElemEnt);*     `return groupIu}íElemenu;
  ! };

`!  _proto"_addNo|Found = function _addNOtFound()({
      $OWdefauìt['default'](SELESTOR_SEARCH_RESULTS_GROUX9®appund(this._vanderItem(t(is.options.notFoujdTmxt$ '#', []));
    ]&// tatis
 ! 0;

(   SidebarSuarch._jQuepyInterf`ce = funcvion _jQueryInterface(config) {
      va2 dava =!$__default[deâault'Y(this).date(@ATA_KEY$4);

      yf`¨!datÁ) z*        daa = $__default['dEfault&] this).data();
 " 0  }
J      a² _options = $__default['fefAult'].Extend({}, Defáult$t, typeo& config ý<= 'object' ?$config : data);

! a ( var plugin = new SidererSear#h($_defau,t['defeult'](|his), _optionó);   "  ,__degault['dEfaunt'](thi{).di4q(DATA_KEY$4, typeof config <== 'objecp' ? config : daôa);

 $    if (typeof config ==9 wstring. &f /init|togçle|closelopUn|search/.ôest(c{jfiç) {
    0  plugin[config]();
     } else {
        plugin.init();
 *    }
    };

 $  råturn SidebaóSearch?
  }();
  /**
 ¡ * Data@PI
$  * =======|===================<>==½===============
   */


  $__defaelt['defa5lt'](dOcument).o.('click%, SELEC\OB_SEARCH_BUTTON, functimn event) {
    avef|.prevenuDgfiult();
    SidejárSdarci®_jQueryInterface.ca,l($__defaultS'|efault'](SELECTOR_DATA_GIDGET$1), 'toggle')»
(!}!;0 $__default[%`ebaul4'](documenv).on('keyup',(SEÅC\OR^SEARCH_INPU$1, function (event) {
$  @ig (etent.keyCkde$== 38) {
   ¤  dvånt.preventDevault()³
    ` $__de&a}lt['default'](SELECTOR_SEARCH_RESULTÓ_GROUP).childrån).Last().focus,);
      seuurn;
    u

    if (event.ieyCofu == 40) {
      eðent.preventDenAu|t(9;
   (  $_[default['defaul|'](SELECTOR_SEARCH_RE3ULÔS_GR^UP	.children().first().eocus();
      2eturn:  $ }

   $setTimeowdfunction () {
  (   SkdebazSEargh._jUueryIbterface.ãalì(&^_default[#default'M(WELECTOR_DATA_VIDGET$I	, 'search')+
 ( `}, 10);
``});
  $__lefaunt['defaulp'](¤ocumenp).no(':eydowf', SELAGTOZ_SERÃI_RÅSULTS_GROU, lunction (Event) {
    var $æocused = $__defewlt['dEfault'(':fncus');

    if (efejt.keyCode == 38) {
  (  !event.prevenôefault();

      if ($fïcused.is(':first-cjild')© {
        $focused.siblilgs*	.lst().focus();
      } else({
 0     !$focused.prev()®foCus();
    ( }
    }

    if ©event.keyCode == 40) {J      eveot.pveventDefault();

  "   if ($focused.is(':last-cxild')) {
        $¦ocused.si`lings().firót(©.focus();
      } else z
 $   `  $focused.next().focus();
      }
    }
  });
  $[_eegaudt['lefault']window).on,'load', funct9on ()`{
    SidebarÓEarch._jQueò9Interfac%.ã`ll(__defaultZ%dEfault§] SELECTOR_DAA_WIDGET$1), 'inip');
  }i;
  /**
 " * jQuery API
   * =½============<½===?=====-=======8=================0  */
  $__default['defatlt&].fn[NAME$4] = [mdebarÓea2ch._jQueryInverface:
!  __de&ault['default'].fn[NAMG$4].ConwtRuc4or = SmdubabSearch»

° $__devault[tefault'].fn[N@ME$4]nnoConflict = &qnction () {
    $__dgfault['defcult'].fnXNAME$4Ý = JQUERyNO_CONÆLICT44{
    rev5rn SidebárSearch._jQuer9intarfpce;
( }9
  /**
   * ----------%-------------------------­-,--=)-
   * AdlinLTU NaVbaòSearch.js
   * Liceîse MIT
   * ----------------,------­--------m----------
   ª/
  /**
  `* Constants
  !* 5====}=i9===========5=======================<======
   */
  vqr NAMA$3 = NavbarRearch7;
  nar LATA_KEY$s = 'ltennasb`p=searcm';
 $var JQUESY_FO_CÏNFLICT$3 = $__dufAult['dufaunt'.Fn[NAMÇ$3_;
  var WELeCTOB_TOGG\E_BTTTON < '[data-widget="navbar­searci"]';
  vqr SELECOR_SE@CHßBLKG[$5 '.návbaò-search-bkogk';
  var SELECTOR_SEARGH_INRUT0= '/forí-cçntrol';
  var0ÃLASS_NQME_OPEN$1 ] 'n`vbar-search-opgn':à var Defaõlt$3 = {
 $  ræsetOnClOse: true(
    tavgEp: SELCTOR_SEARCH_BLOCK
  };  /*"
   * Class Dgfknitmoj
!b * 5====5====½===========?==============9======?======}
 ( */
  rcr BavjarCeerch = /*#__PURE__*/function0()({
   `fencthon$NavbarSeazch(_element, _options¡ {Š    ! this._elmment = _dlement;
"     |hyw._config = $__defAult[def#ulô']®extand({}< Default$3, _options9;
  0 } //Puâlkc


 !  var _pro4î = LavbarSearch.prototype;

    _proto.open = function open() {
      $__default['default'](this._config.target).css('display', 'flex').hide().fadeIn().addClass(CLASS_NAME_OPEN$1);
      $__default['default'](this._config.target + " " + SELECTOR_SEARCH_INPUT).focus();
    };

    _proto.close = function close() {
      $__default['default'](this._config.target).fadeOut().removeClass(CLASS_NAME_OPEN$1);

      if (this._config.resetOnClose) {
        $__default['default'](this._config.target + " " + SELECTOR_SEARCH_INPUT).val('');
      }
    };

    _proto.toggle = function toggle() {
      if ($__default['default'](this._config.target).hasClass(CLASS_NAME_OPEN$1)) {
        this.close();
      } else {
        this.open();
      }
    } // Static
    ;

    NavbarSearch._jQueryInterface = function _jQueryInterface(options) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$3);

        var _options = $__default['default'].extend({}, Default$3, $__default['default'](this).data());

        if (!data) {
          data = new NavbarSearch(this, _options);
          $__default['default'](this).data(DATA_KEY$3, data);
        }

        if (!/toggle|close|open/.test(options)) {
          throw new Error("Undefined method " + options);
        }

        data[options]();
      });
    };

    return NavbarSearch;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](document).on('click', SELECTOR_TOGGLE_BUTTON, function (event) {
    event.preventDefault();
    var button = $__default['default'](event.currentTarget);

    if (button.data('widget') !== 'navbar-search') {
      button = button.closest(SELECTOR_TOGGLE_BUTTON);
    }

    NavbarSearch._jQueryInterface.call(button, 'toggle');
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$3] = NavbarSearch._jQueryInterface;
  $__default['default'].fn[NAME$3].Constructor = NavbarSearch;

  $__default['default'].fn[NAME$3].noConflict = function () {
    $__default['default'].fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return NavbarSearch._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Toasts.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$2 = 'Toasts';
  var DATA_KEY$2 = 'lte.toasts';
  var EVENT_KEY$1 = "." + DATA_KEY$2;
  var JQUERY_NO_CONFLICT$2 = $__default['default'].fn[NAME$2];
  var EVENT_INIT = "init" + EVENT_KEY$1;
  var EVENT_CREATED = "created" + EVENT_KEY$1;
  var EVENT_REMOVED = "removed" + EVENT_KEY$1;
  var SELECTOR_CONTAINER_TOP_RIGHT = '#toastsContainerTopRight';
  var SELECTOR_CONTAINER_TOP_LEFT = '#toastsContainerTopLeft';
  var SELECTOR_CONTAINER_BOTTOM_RIGHT = '#toastsContainerBottomRight';
  var SELECTOR_CONTAINER_BOTTOM_LEFT = '#toastsContainerBottomLeft';
  var CLASS_NAME_TOP_RIGHT = 'toasts-top-right';
  var CLASS_NAME_TOP_LEFT = 'toasts-top-left';
  var CLASS_NAME_BOTTOM_RIGHT = 'toasts-bottom-right';
  var CLASS_NAME_BOTTOM_LEFT = 'toasts-bottom-left';
  var POSITION_TOP_RIGHT = 'topRight';
  var POSITION_TOP_LEFT = 'topLeft';
  var POSITION_BOTTOM_RIGHT = 'bottomRight';
  var POSITION_BOTTOM_LEFT = 'bottomLeft';
  var Default$2 = {
    position: POSITION_TOP_RIGHT,
    fixed: true,
    autohide: false,
    autoremove: true,
    delay: 1000,
    fade: true,
    icon: null,
    image: null,
    imageAlt: null,
    imageHeight: '25px',
    title: null,
    subtitle: null,
    close: true,
    body: null,
    class: null
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Toasts = /*#__PURE__*/function () {
    function Toasts(element, config) {
      this._config = config;

      this._prepareContainer();

      $__default['default']('body').trigger($__default['default'].Event(EVENT_INIT));
    } // Public


    var _proto = Toasts.prototype;

    _proto.create = function create() {
      var toast = $__default['default']('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"/>');
      toast.data('autohide', this._config.autohide);
      toast.data('animation', this._config.fade);

      if (this._config.class) {
        toast.addClass(this._config.class);
      }

      if (this._config.delay && this._config.delay != 500) {
        toast.data('delay', this._config.delay);
      }

      var toastHeader = $__default['default']('<div class="toast-header">');

      if (this._config.image != null) {
        var toastImage = $__default['default']('<img />').addClass('rounded mr-2').attr('src', this._config.image).attr('alt', this._config.imageAlt);

        if (this._config.imageHeight != null) {
          toastImage.height(this._config.imageHeight).width('auto');
        }

        toastHeader.append(toastImage);
      }

      if (this._config.icon != null) {
        toastHeader.append($__default['default']('<i />').addClass('mr-2').addClass(this._config.icon));
      }

      if (this._config.title != null) {
        toastHeader.append($__default['default']('<strong />').addClass('mr-auto').html(this._config.title));
      }

      if (this._config.subtitle != null) {
        toastHeader.append($__default['default']('<small />').html(this._config.subtitle));
      }

      if (this._config.close == true) {
        var toastClose = $__default['default']('<button data-dismiss="toast" />').attr('type', 'button').addClass('ml-2 mb-1 close').attr('aria-label', 'Close').append('<span aria-hidden="true">&times;</span>');

        if (this._config.title == null) {
          toastClose.toggleClass('ml-2 ml-auto');
        }

        toastHeader.append(toastClose);
      }

      toast.append(toastHeader);

      if (this._config.body != null) {
        toast.append($__default['default']('<div class="toast-body" />').html(this._config.body));
      }

      $__default['default'](this._getContainerId()).prepend(toast);
      var $body = $__default['default']('body');
      $body.trigger($__default['default'].Event(EVENT_CREATED));
      toast.toast('show');

      if (this._config.autoremove) {
        toast.on('hidden.bs.toast', function () {
          $__default['default'](this).delay(200).remove();
          $body.trigger($__default['default'].Event(EVENT_REMOVED));
        });
      }
    } // Static
    ;

    _proto._getContainerId = function _getContainerId() {
      if (this._config.position == POSITION_TOP_RIGHT) {
        return SELECTOR_CONTAINER_TOP_RIGHT;
      }

      if (this._config.position == POSITION_TOP_LEFT) {
        return SELECTOR_CONTAINER_TOP_LEFT;
      }

      if (this._config.position == POSITION_BOTTOM_RIGHT) {
        return SELECTOR_CONTAINER_BOTTOM_RIGHT;
      }

      if (this._config.position == POSITION_BOTTOM_LEFT) {
        return SELECTOR_CONTAINER_BOTTOM_LEFT;
      }
    };

    _proto._prepareContainer = function _prepareContainer() {
      if ($__default['default'](this._getContainerId()).length === 0) {
        var container = $__default['default']('<div />').attr('id', this._getContainerId().replace('#', ''));

        if (this._config.position == POSITION_TOP_RIGHT) {
          container.addClass(CLASS_NAME_TOP_RIGHT);
        } else if (this._config.position == POSITION_TOP_LEFT) {
          container.addClass(CLASS_NAME_TOP_LEFT);
        } else if (this._config.position == POSITION_BOTTOM_RIGHT) {
          container.addClass(CLASS_NAME_BOTTOM_RIGHT);
        } else if (this._config.position == POSITION_BOTTOM_LEFT) {
          container.addClass(CLASS_NAME_BOTTOM_LEFT);
        }

        $__default['default']('body').append(container);
      }

      if (this._config.fixed) {
        $__default['default'](this._getContainerId()).addClass('fixed');
      } else {
        $__default['default'](this._getContainerId()).removeClass('fixed');
      }
    } // Static
    ;

    Toasts._jQueryInterface = function _jQueryInterface(option, config) {
      return this.each(function () {
        var _options = $__default['default'].extend({}, Default$2, config);

        var toast = new Toasts($__default['default'](this), _options);

        if (option === 'create') {
          toast[option]();
        }
      });
    };

    return Toasts;
  }();
  /**
   * jQuery API
   * ====================================================
   */


  $__default['default'].fn[NAME$2] = Toasts._jQueryInterface;
  $__default['default'].fn[NAME$2].Constructor = Toasts;

  $__default['default'].fn[NAME$2].noConflict = function () {
    $__default['default'].fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Toasts._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE TodoList.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME$1 = 'TodoList';
  var DATA_KEY$1 = 'lte.todolist';
  var JQUERY_NO_CONFLICT$1 = $__default['default'].fn[NAME$1];
  var SELECTOR_DATA_TOGGLE = '[data-widget="todo-list"]';
  var CLASS_NAME_TODO_LIST_DONE = 'done';
  var Default$1 = {
    onCheck: function onCheck(item) {
      return item;
    },
    onUnCheck: function onUnCheck(item) {
      return item;
    }
  };
  /**
   * Class Definition
   * ====================================================
   */

  var TodoList = /*#__PURE__*/function () {
    function TodoList(element, config) {
      this._config = config;
      this._element = element;

      this._init();
    } // Public


    var _proto = TodoList.prototype;

    _proto.toggle = function toggle(item) {
      item.parents('li').toggleClass(CLASS_NAME_TODO_LIST_DONE);

      if (!$__default['default'](item).prop('checked')) {
        this.unCheck($__default['default'](item));
        return;
      }

      this.check(item);
    };

    _proto.check = function check(item) {
      this._config.onCheck.call(item);
    };

    _proto.unCheck = function unCheck(item) {
      this._config.onUnCheck.call(item);
    } // Private
    ;

    _proto._init = function _init() {
      var _this = this;

      var $toggleSelector = this._element;
      $toggleSelector.find('input:checkbox:checked').parents('li').toggleClass(CLASS_NAME_TODO_LIST_DONE);
      $toggleSelector.on('change', 'input:checkbox', function (event) {
        _this.toggle($__default['default'](event.target));
      });
    } // Static
    ;

    TodoList._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY$1);

        if (!data) {
          data = $__default['default'](this).data();
        }

        var _options = $__default['default'].extend({}, Default$1, typeof config === 'object' ? config : data);

        var plugin = new TodoList($__default['default'](this), _options);
        $__default['default'](this).data(DATA_KEY$1, typeof config === 'object' ? config : data);

        if (config === 'init') {
          plugin[config]();
        }
      });
    };

    return TodoList;
  }();
  /**
   * Data API
   * ====================================================
   */


  $__default['default'](window).on('load', function () {
    TodoList._jQueryInterface.call($__default['default'](SELECTOR_DATA_TOGGLE));
  });
  /**
   * jQuery API
   * ====================================================
   */

  $__default['default'].fn[NAME$1] = TodoList._jQueryInterface;
  $__default['default'].fn[NAME$1].Constructor = TodoList;

  $__default['default'].fn[NAME$1].noConflict = function () {
    $__default['default'].fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return TodoList._jQueryInterface;
  };

  /**
   * --------------------------------------------
   * AdminLTE Treeview.js
   * License MIT
   * --------------------------------------------
   */
  /**
   * Constants
   * ====================================================
   */

  var NAME = 'Treeview';
  var DATA_KEY = 'lte.treeview';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $__default['default'].fn[NAME];
  var EVENT_EXPANDED = "expanded" + EVENT_KEY;
  var EVENT_COLLAPSED = "collapsed" + EVENT_KEY;
  var EVENT_LOAD_DATA_API = "load" + EVENT_KEY;
  var SELECTOR_LI = '.nav-item';
  var SELECTOR_LINK = '.nav-link';
  var SELECTOR_TREEVIEW_MENU = '.nav-treeview';
  var SELECTOR_OPEN = '.menu-open';
  var SELECTOR_DATA_WIDGET = '[data-widget="treeview"]';
  var CLASS_NAME_OPEN = 'menu-open';
  var CLASS_NAME_IS_OPENING = 'menu-is-opening';
  var CLASS_NAME_SIDEBAR_COLLAPSED = 'sidebar-collapse';
  var Default = {
    trigger: SELECTOR_DATA_WIDGET + " " + SELECTOR_LINK,
    animationSpeed: 300,
    accordion: true,
    expandSidebar: false,
    sidebarButtonSelector: '[data-widget="pushmenu"]'
  };
  /**
   * Class Definition
   * ====================================================
   */

  var Treeview = /*#__PURE__*/function () {
    function Treeview(element, config) {
      this._config = config;
      this._element = element;
    } // Public


    var _proto = Treeview.prototype;

    _proto.init = function init() {
      $__default['default']("" + SELECTOR_LI + SELECTOR_OPEN + " " + SELECTOR_TREEVIEW_MENU + SELECTOR_OPEN).css('display', 'block');

      this._setupListeners();
    };

    _proto.expand = function expand(treeviewMenu, parentLi) {
      var _this = this;

      var expandedEvent = $__default['default'].Event(EVENT_EXPANDED);

      if (this._config.accordion) {
        var openMenuLi = parentLi.siblings(SELECTOR_OPEN).first();
        var openTreeview = openMenuLi.find(SELECTOR_TREEVIEW_MENU).first();
        this.collapse(openTreeview, openMenuLi);
      }

      parentLi.addClass(CLASS_NAME_IS_OPENING);
      treeviewMenu.stop().slideDown(this._config.animationSpeed, function () {
        parentLi.addClass(CLASS_NAME_OPEN);
        $__default['default'](_this._element).trigger(expandedEvent);
      });

      if (this._config.expandSidebar) {
        this._expandSidebar();
      }
    };

    _proto.collapse = function collapse(treeviewMenu, parentLi) {
      var _this2 = this;

      var collapsedEvent = $__default['default'].Event(EVENT_COLLAPSED);
      parentLi.removeClass(CLASS_NAME_IS_OPENING + " " + CLASS_NAME_OPEN);
      treeviewMenu.stop().slideUp(this._config.animationSpeed, function () {
        $__default['default'](_this2._element).trigger(collapsedEvent);
        treeviewMenu.find(SELECTOR_OPEN + " > " + SELECTOR_TREEVIEW_MENU).slideUp();
        treeviewMenu.find(SELECTOR_OPEN).removeClass(CLASS_NAME_OPEN);
      });
    };

    _proto.toggle = function toggle(event) {
      var $relativeTarget = $__default['default'](event.currentTarget);
      var $parent = $relativeTarget.parent();
      var treeviewMenu = $parent.find("> " + SELECTOR_TREEVIEW_MENU);

      if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
        if (!$parent.is(SELECTOR_LI)) {
          treeviewMenu = $parent.parent().find("> " + SELECTOR_TREEVIEW_MENU);
        }

        if (!treeviewMenu.is(SELECTOR_TREEVIEW_MENU)) {
          return;
        }
      }

      event.preventDefault();
      var parentLi = $relativeTarget.parents(SELECTOR_LI).first();
      var isOpen = parentLi.hasClass(CLASS_NAME_OPEN);

      if (isOpen) {
        this.collapse($__default['default'](treeviewMenu), parentLi);
      } else {
        this.expand($__default['default'](treeviewMenu), parentLi);
      }
    } // Private
    ;

    _proto._setupListeners = function _setupListeners() {
      var _this3 = this;

      var elementId = this._element.attr('id') !== undefined ? "#" + this._element.attr('id') : '';
      $__default['default'](document).on('click', "" + elementId + this._config.trigger, function (event) {
        _this3.toggle(event);
      });
    };

    _proto._expandSidebar = function _expandSidebar() {
      if ($__default['default']('body').hasClass(CLASS_NAME_SIDEBAR_COLLAPSED)) {
        $__default['default'](this._config.sidebarButtonSelector).PushMenu('expand');
      }
    } // Static
    ;

    Treeview._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $__default['default'](this).data(DATA_KEY);

        var _options = $__default['default']ÿÿÿÿÿÿÿûÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿ¿ÿûÿÿÿ÷ÿÿÿýÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿ¿ÿÿÿÿÿßÿÿýÿÿÿÿÿÿÿÿÿïÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿ~ÿÿÿÿïÿÿÿÿÿþÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿïÿÿ¿ÿÿÿßÿþÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿïÿÿÿÿÿÿÿÿÿÿÿÿÿçÿÿÿÿÿÿÿÿÿÿÿÿÿ^ÿÿÿýÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿßÿûÿÿÿÿÿÿÿÿÿÿÿÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿïÿÿÿÿÿÿÿûÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ïÿÿÿÿÿÿÿÿÿÿÿÿ{ÿÿÿÿÿÿýÿþÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿïÿÿþÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿßÿÿÿÿÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿÿÿÿÿûÿÿÿÿÿÿÿÿÿûýÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿïÿÿïÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿßÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿþÿßÿÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÝ¿ÿÿÿÿÿ¿ÿÿÿþÿÿÿÿÿ¿ÿÿþÿÿÿÿÿÿÿÿÿÿÿûÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿïÿûÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿïÿ÷ÿÿÿÿÿÿßÿÿÿÿÿÿÿïÿÿÿÿïÿÿÿÿÿÿÿÿÿÿÿÿÿþÿßÿÿÿÿÿÿÿßûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýÿÿÿÿÿÿÿÿÿÿÿÿÿÿý÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿßÿÿÿ÷ÿÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿïÿÿÿÿÿŸÿÿÿÿÿÿÿÿÿÿÿÿÿúÿÿÿÿÿÿÿÿÿÿÿÿÿÿßÿÿÿÿÿÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿÿÿÿÿ¿ÿßÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ëÿÿÿÿÿÿÿÿÿßÿÿÿÿÿÿÿÿÿÿÿÿÿßÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿïÿÿûÿÿÿÿÿÿÿÿÿÿýÿÿ{ÿÿÿÿÿÿÿÿÿÿÿÿûÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýÿÿÿÿÿÿÿÿÿÿÿßÿÿÿßÿþÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýÿýÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿþÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿïÿ¿ßÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿþÿÿÿßÿÿÿÿÿÿßÿÿÿÿÿÿÿûÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿþÿÿÿÿÿÿÿÿÿÿýÿïÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿþëÿÿÿÿûÿÿþÿÿÿÿÿÿÿÿ¿ÿÿÿÿÿÿ÷ÿÿÿÿÿý÷ÿÿÿÿÿÿÿÿßÿÿûÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿûþÿÿÿÿÿÿ÷ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿýÿÿÿÿÿÿÿÿÿÿÿÿÿ