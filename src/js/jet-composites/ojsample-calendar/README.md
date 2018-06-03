# ojsample-calendar

**hed-calendar** fork

The **`<ojsample-calendar>`** component is a wrapper around [FullCalendar](https://fullcalendar.io/docs/) version 3.4.0. The FullCalendar library code is provided within the CCA. There were several lines of modifications needed in the original code in order to help with accessibility.

The **`<ojsample-calendar>`** component has added changes to the final HTML markup to help with keyboard navigation and general accessibility with screen readers. Swipe left and right has also been enabled when the calendar is used on a mobile device.

_**Note:** When in Chrome and in IPad mode etc.. Swipe does not work as expected but does work on an actual device._

_**IMPORTANT NOTE:** moment' must be included in you project since FullCalendar's define will call it by that name._

For accessibility it is recommended that only the list or agenda views be provided to users using a screen reader or relying on just keyboard navigation.

The header and footer have been removed, they could not be made accessible and were not using properly styled JET buttons.

For general documentation of all the available options please read the [FullCalendar API Documentation](https://fullcalendar.io/docs/) with a few modifications.

#### Provided Views ####
* AccessibleMonthView
* AccessibleListMont
* AccessibleWeekAgendaView
* AccessibleListWeek
* AccessibleDayAgendaView
* AccessibleListDay
* AccessibleListYear

#### Options Removed: ####
* header
* footer
* customButtons
* buttonIcons
* themeButtonIcons
* bootstrapGlyphicons
* destroy
* duration
* dayCount
* buttonText
* titleFormat
* Event on/off format
* themeSystem (May want to reconsider)

#### Options with variations ####
CCAs would prefer that when setting up properties that the values used are predefined and strict. When a FullCalendar option allowed multiple types of parameters we instead created multiple properties. When this is the case, only use one of the options. If you use more than one, you will not know which actually took affect. There were also a few cases where the same property name was used for both a method that could be called and also as a callback property or conflicted with JET.

* getView (Conflict with JET)
    * getCurrentView(method)
* select (method, callback)
    * selectPeriod(method)
    * select(callback)
* unselect (method, callback)
    * unselectPeriod(method)
    * unselect(callback)
* height (number, string, callback)
    * height(number)
    * heightEnum(enum string)
    * heightFunc(callback)
* weekNumberCalculation (string, callback)
    * weekNumberCalculation(enum string)
    * weekNumberCalculationFunc(callback)
* now (string, callback)
    * now(string)
    * nowFunc(callback)
* listDayFormat (string, boolean)
    * listDayFormat(string)
    * listDayFormatBool(boolean)
* eventConstraint (object, string)
    * eventConstraint(object)
    * eventConstraintString(string)
* selectConstraint (object, string)
    * selectConstraint(object)
    * selectConstraintString(string)
* dropAccept (string,callback)
    * dropAccept(string)
    * dropAcceptFunc(callback)



## Usage ##

**View:**
```
<ojsample-calendar id="myCal" weekends="true"
    all-day-slot="true" default-view="AccessibleMonthView"
    event-sources="{{eventSources}}" event-resize="{{eventResize}}"
    event-drop="{{eventResize}}" event-click="{{eventClick}}"
    event-limit="4" event-limit-click="popover"
    view-render="{{viewRender}}" business-hours="{{businessHours}}"
    event-render="{{eventRender}}" nav-links="true"
    now-indicator="true" timezone="local"></ojsample-calendar>
```

**Model:**
```
self.eventSources =  ko.observableArray([
  {
    id: 'source1',
    events: [{
          id: startId,
          title: 'A title',
          start: startDate,
          end: endDate,
          allDay: false
        }],
    color: 'yellow',
    textColor: 'black',
    eventType: 'Yellow Events'
  },
  {
    id: 'source2',
    editable: true,
    events: [{
          id: startId,
          title: 'Another title',
          start: startDate,
          end: endDate,
          allDay: false
        }],
    color: 'blue',
    eventType: 'Blue Events'
  }
]);

self.eventResize = function(event, delta, revertFunc, jsEvent, ui, view) {
    // Here I could make a service call to update event.
};

self.eventClick = function(calEvent, jsEvent, view) {
    // Here I could show an edit or detail modal
};

self.viewRender = function(view) {
    // A new view is rendered, I could update a navigation or title bar
}

self.businessHours = ko.observableArray([
    {
        dow:[1,2,3,4,5],
        start:'09:00',
        end:'17:00'
    }
]);

self.eventRender = function(event, element, view) {
    // Alter how certain events look
    if (view && view.type === 'AccessibleMonthView') {
        var eventContent = $('.fc-content', element);
        eventContent.attr('style', 'white-space:normal;')
        element.attr('style', element.attr('style')+'; height:100%;')
        eventContent.prepend('<i class="fa fa-info-circle" aria-hidden="true"></i>');
    }
};

```
