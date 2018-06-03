/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojdialog',
  'ojs/ojbutton', 'hammerjs', 'moment',
  './lib/fullcalendar/dist/fullcalendar.modified.min',
  './ojsample-calendar-accessibility'],
  // Did not use CDN for moment since FullCalendar's define requires it to be 'moment' and not a CDN.
  function (oj, ko) {
    function CalendarModel(context) {
      var self = this;

      self.unique = context.unique;
      self.element = context.element;
      self.thisCalendar;
      self.thisCalendarDialog;
      self.handledProperties = {}; // Keep track of calendar properties we have processed.
      self.metadata;
      self.calOptions;
      self.listeners = {};

      self.currentView;
      // Called anytime the view changes
      self.viewRender = function (view, element) {
        if (self.element.getProperty('viewRender')) {
          //view = {
          //  name: ,
          //  title: ,
          //  start: ,
          //  end: ,
          //  intervalStart: ,
          //  intervalEnd:
          //}
          var clone = $.extend({}, view);
          self.element.getProperty('viewRender').apply(null, [view]);
        }
      };

      // The props field on context is a Promise. Once that resolves,
      // we can access the properties that were defined in the composite metadata
      // and were initially set on the composite DOM element.
      context.props.then(function (properties) {
        oj.Composite.getMetadata('ojsample-calendar').then(function (metadata) {
          self.metadata = metadata;
          self.calOptions = self.buildOptions(metadata.properties);
          self.calOptions.viewRender = self.viewRender;
        });
      });

      /**
       * @description Change the calendar view to a few view
       * @param {String} viewName The view to switch to. [month,listMonth,agendaWeek,basicWeek,listWeek,agendaDay,basicDay,listDay,listYear]
       */
      self.changeView = function (viewName, date) {
        self.thisCalendar.fullCalendar('changeView', viewName, date);
      };
      self.moment = function () {
        return self.thisCalendar.fullCalendar('moment');
      };
      self.formatRange = function (moment1, moment2, formatString, separator, isRTL) {
        return self.thisCalendar.fullCalendar('formatRange', moment1, moment2, formatString, separator, isRTL);
      };
      self.render = function () {
        self.thisCalendar.fullCalendar('render');
      };
      self.getCurrentView = function () {
        return self.thisCalendar.fullCalendar('getView');
      };
      self.prev = function () {
        self.thisCalendar.fullCalendar('prev');
      };
      self.next = function () {
        self.thisCalendar.fullCalendar('next');
      };
      self.prevYear = function () {
        self.thisCalendar.fullCalendar('prevYear');
      };
      self.nextYear = function () {
        self.thisCalendar.fullCalendar('nextYear');
      };
      self.today = function () {
        self.thisCalendar.fullCalendar('today');
      };
      self.gotoDate = function (date) {
        self.thisCalendar.fullCalendar('gotoDate', date);
      };
      self.incrementDate = function (duration) {
        self.thisCalendar.fullCalendar('incrementDate', duration);
      };
      self.getDate = function () {
        return self.thisCalendar.fullCalendar('getDate');
      };
      // Had to be renamed select/unselect since they conflict with callback properties
      self.selectPeriod = function (start, end, resource) {
        self.thisCalendar.fullCalendar('select', start, end, resource);
      };
      self.unselectPeriod = function () {
        self.thisCalendar.fullCalendar('unselect');
      };
      self.updateEvent = function (event) {
        self.thisCalendar.fullCalendar('updateEvent', event);
      };
      self.updateEvents = function (events) {
        self.thisCalendar.fullCalendar('updateEvents', events);
      };
      self.clientEvents = function (idOrFilter) {
        return self.thisCalendar.fullCalendar('clientEvents', idOrFilter);
      };
      self.removeEvents = function (idOrFilter) {
        self.thisCalendar.fullCalendar('removeEvents', idOrFilter);
      };
      self.refetchEvents = function () {
        self.thisCalendar.fullCalendar('refetchEvents');
      };
      self.refetchEventSources = function (sources) {
        self.thisCalendar.fullCalendar('refetchEventSources', sources);
      };
      self.addEventSource = function (source) {
        self.thisCalendar.fullCalendar('addEventSource', source);
      };
      self.removeEventSource = function (source) {
        self.thisCalendar.fullCalendar('removeEventSource', source);
      };
      self.removeEventSources = function (sources) {
        self.thisCalendar.fullCalendar('removeEventSources', sources);
      };
      self.getEventSources = function () {
        return self.thisCalendar.fullCalendar('getEventSources');
      };
      self.getEventSourceById = function (id) {
        return self.thisCalendar.fullCalendar('getEventSourceById', id);
      };
      self.renderEvent = function (event, stick) {
        self.thisCalendar.fullCalendar('renderEvent', event, stick);
      };
      self.renderEvents = function (events, stick) {
        self.thisCalendar.fullCalendar('renderEvents', events, stick);
      };
      self.rerenderEvents = function () {
        self.thisCalendar.fullCalendar('rerenderEvents');
      };

      self.calSwipe = function (model, jqueryEvent) {
        // Check if RTL, then do oppisite.
        if (jqueryEvent.gesture.direction === Hammer["DIRECTION_LEFT"]) {
          self.element.getProperty('rtl') ? self.thisCalendar.fullCalendar('prev') : self.thisCalendar.fullCalendar('next');
        } else if (jqueryEvent.gesture.direction === Hammer["DIRECTION_RIGHT"]) {
          self.element.getProperty('rtl') ? self.thisCalendar.fullCalendar('next') : self.thisCalendar.fullCalendar('prev');
        }
      };

      /**
       * @description Generate the options object needed to build the calendar.
       */
      self.buildOptions = function (properties) {
        var options = {};

        // First handle all the properties that are not handled in a default manner
        options = self.setOptionProperty(options, 'rtl', 'isRTL', true);
        options = self.setOptionProperty(options, 'weekNumberCalculationFunc', 'weekNumberCalculation', false);
        options = self.setOptionProperty(options, 'heightEnum', 'height', true);
        options = self.setOptionProperty(options, 'heightFunc', 'height', false);
        options = self.setOptionProperty(options, 'nowFunc', 'now', false);
        options = self.setOptionProperty(options, 'listDayFormatBool', 'listDayFormat', true);
        options = self.setOptionProperty(options, 'listDayAltFormatBool', 'listDayAltFormat', true);
        options = self.setOptionProperty(options, 'eventConstraintString', 'eventConstraint', true);
        options = self.setOptionProperty(options, 'selectConstraintString', 'selectConstraint', true);
        options = self.setOptionProperty(options, 'dropAcceptFunc', 'dropAccept', false);


        // Do not know what the plan is for the events and how we will listen for changes or if we want to.
        options = self.setOptionProperty(options, 'eventSources', 'eventSources', false);

        // Handle all the generic properties.
        for (var ccaProp in properties) {
          if (!self.handledProperties[ccaProp]) {
            if (self.metadata.properties[ccaProp].type.startsWith('function')) {
              options = self.setOptionProperty(options, ccaProp, ccaProp, false);
            } else {
              options = self.setOptionProperty(options, ccaProp, ccaProp, true);
            }
          }
        }

        return options;
      };

      /**
       * Create a simple listener for calendar options
       */
      self.createListener = function (ccaProp, calProp) {
        var handleChanged = function (event) {
          self.thisCalendar.fullCalendar('option', calProp, self.element.getProperty(ccaProp));
        };
        self.element.addEventListener(ccaProp + 'Changed', handleChanged);
        self.listeners[ccaProp + 'Changed'] = handleChanged;
      };

      /**
       * @description Add a property to an object and create the property listener, if specified.
       * @param {Object} obj The object to add the property to
       * @param {String} ccaProp The name of the property as known by the ccaProp
       * @param {String} calProp The name of the property as known by fullCalendar
       * @param {Boolean} attachListener Should we attach a simple listener to the property
       * @returns {Object} The original object passed as obj.
       */
      self.setOptionProperty = function (obj, ccaProp, calProp, attachListener) {
        self.handledProperties[ccaProp] = true;
        if (self.element.getProperty(ccaProp) !== undefined) {
          obj[calProp] = self.element.getProperty(ccaProp);
          if (attachListener) {
            // Also set up a listener
            self.createListener(ccaProp, calProp);
          }
        }

        return obj;
      };

      /**
      The activated lifecycle method is called and passed the standard context
      object. At the point in time that this method executes, the base Composite
      Component element will exist in the HTML DOM, however it will not yet have
      any child nodes so you cannot manipulate the UI at this stage.
      */
      self.activated = function (context) { };

      /**
      The attached lifecycle method is called and passed the standard context
      object. At this phase, the view defined by the Composite Component
      bootstrap script will have been processed and the Composite Component
      element will now have child elements in the DOM that you can locate and
      manipulate if necessary. If you need to set up any viewModel values that
      will be used by knockout bindings in the generated view, this is your last
      chance to do so.
      */
      self.attached = function (context) { };

      /**
      The bindingsApplied lifecycle method is called and passed the standard
      context object. At this phase, the Knockout applyBindings has been called
      on the subtree and any data-bind or other Knockout directives will have
      been applied. Thus it would be too late to change a DOM element to add a
      data-bind at this stage.
      */
      self.bindingsApplied = function (context) {
        context.props.then(function (properties) {
          // Instantiate our FullCalendar Object
          // We never want the header or footer, they are not accessible. We will need to build our own.
          self.calOptions['header'] = false;
          self.calOptions['footer'] = false;
          self.thisCalendar = $('#innerHedCal' + context.unique, $(context.element)).fullCalendar(self.calOptions);
          self.thisCalendarDialog = $('#innerHedCalDialog' + context.unique, $(context.element));
          // Note: When in Chrome and in IPad mode etc.. Swipe does not work as expected but does work on an actual device.
          if (oj.DomUtils.isTouchSupported()) {
            var cal = $('#innerHedCal' + self.unique)[0];
            var mc = new Hammer(cal);
            mc.get('swipe').set({
              direction: Hammer["DIRECTION_HORIZONTAL"]
            });
          }
        });
      };

      /**
      As a module containing this Composite Component is being replaced, this
      dispose lifecycle method is called with a reference to the Composite
      element object. This gives you the opportunity to do clean up if required.
      Note that dispose does not get called if the user resets the page with a
      manual browser refresh or explicit navigation that does not first replace
      the current module. Therefore, you cannot rely on this method as the only
      way of releasing resources.
      */
      self.dispose = function (context) {
        for (var prop in self.listeners) {
          self.element.removeEventListener(prop, self.listeners[prop]);
        }
      };
    }

    return CalendarModel;
  }
);
