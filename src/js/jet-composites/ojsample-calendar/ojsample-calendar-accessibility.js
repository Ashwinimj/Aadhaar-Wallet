define(['ojs/ojcore','knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojdialog',
    'ojs/ojbutton', 'hammerjs', 'moment',
    './lib/fullcalendar/dist/fullcalendar.modified.min'],
    // Did not use CDN for moment since FullCalendar's define requires it to be 'moment' and not a CDN.
  function (oj, ko,$) {

    // Add accessibility to FullCalendar
    var FC = $.fullCalendar; // a reference to FullCalendar's root namespace
    var View = FC.View;
    var MonthView = FC.MonthView; // the class that all views must inherit from
    var AgendaView = FC.AgendaView;
    var ListView = FC.ListView;
    var Calendar = FC.Calendar;
    var Grid = FC.Grid;
    var DayGrid = FC.DayGrid;
    var TimeGrid = FC.TimeGrid;
    var ListViewGrid = FC.ListViewGrid;
    var CustomGrid;
    var AccessibleMonthView;          // our subclass

    // Add Enter keypress to events to the calendar Grid
    Grid.mixin({
      bindSegHandlersToEl: function(el) {
        this.bindSegHandlerToEl(el, 'touchstart', this.handleSegTouchStart);
    		this.bindSegHandlerToEl(el, 'mouseenter', this.handleSegMouseover);
    		this.bindSegHandlerToEl(el, 'mouseleave', this.handleSegMouseout);
    		this.bindSegHandlerToEl(el, 'mousedown', this.handleSegMousedown);
    		this.bindSegHandlerToEl(el, 'click', this.handleSegClick);
        //Added so we can have keyboard nav too
        this.bindSegHandlerToEl(el, 'keypress', this.handleKeyPress);
      },

      handleKeyPress: function(seg, ev) {
        if(ev.which == 13 || ev.which == 32){//Enter or spacebar key pressed
          // Treat as a mouse click
          return this.handleSegClick.call(this, seg, ev);
        }
    	}
    });

    Calendar.mixin({
      render: function() {
    		if (!this.contentEl) {
    			this.initialRender();
          this.initialKeyPress();
    		}
    		else if (this.elementVisible()) {
    			// mainly for the public API
    			this.calcSize();
    			this.renderView();
    		}
    	},

      initialKeyPress: function() {
        // After initial render that add mouse clicks, lets add keyboard clicks
        var _this = this;
    		var el = this.el;

        el.on('keypress.fc', 'a[data-goto]', function(ev) {
          if (ev.which == 13  || ev.which == 32) {
            // Enter or spacebar key pressed
            ev.target.click();
          }
        });
      }
    });

    AccessibleMonthView = MonthView.extend({ // make a subclass of View
      initialize: function() {
        MonthView.prototype.initialize.apply(this, arguments);
      },

      onEventsRender: function() {
        // None of our tables are data grids so let the screen read know these are all layout tables
        $('table', this.el).attr('role', 'presentation');
        MonthView.prototype.onEventsRender.apply(this, arguments);
    	},

      instantiateDayGrid: function() {
        // Extend some grid functions we want to inject some data.
        // This is dirty but we are usually just adding aria attributes as necessary.
        var gridSubclass = MonthView.prototype.instantiateDayGrid.apply(this, arguments);
        gridSubclass.renderMoreLink = basicDayGridMethods.renderMoreLink;
        gridSubclass.showSegPopover = basicDayGridMethods.showSegPopover;
        gridSubclass.limitRow = basicDayGridMethods.limitRow;
        gridSubclass.fgSegHtml = basicDayGridMethods.fgSegHtml;
        gridSubclass.renderHeadDateCellHtml = basicDayGridMethods.renderHeadDateCellHtml;
        gridSubclass.renderNumberCellHtml = basicDayGridMethods.renderNumberCellHtml;

        return gridSubclass;
    	},

      buildGotoAnchorHtml: function(gotoOptions, attrs, innerHtml) {
        var html = MonthView.prototype.buildGotoAnchorHtml.apply(this, arguments);

        return basicMethods.buildGotoAnchorHtml(html);
      }
    });

    AccessibleDayAgendaView = AgendaView.extend({ // make a subclass of View
      initialize: function() {
        AgendaView.prototype.initialize.apply(this, arguments);
      },

      onEventsRender: function() {
        // None of our tables are data grids so let the screen read know these are all layout tables
        $('table', this.el).attr('role', 'presentation');
        AgendaView.prototype.onEventsRender.apply(this, arguments);
    	},

      instantiateDayGrid: function() {
        // Extend some grid functions we want to inject some data
        var gridSubclass = AgendaView.prototype.instantiateDayGrid.apply(this, arguments);
        gridSubclass.renderMoreLink = basicDayGridMethods.renderMoreLink;
        gridSubclass.showSegPopover = basicDayGridMethods.showSegPopover;
        gridSubclass.limitRow = basicDayGridMethods.limitRow;
        gridSubclass.fgSegHtml = basicDayGridMethods.fgSegHtml;

        return gridSubclass;
    	},

      instantiateTimeGrid: function() {
        // Extend some grid functions we want to inject some data
        var gridSubclass = AgendaView.prototype.instantiateTimeGrid.apply(this, arguments);
        gridSubclass.fgSegHtml = timeGridMethods.fgSegHtml;
        gridSubclass.renderHeadIntroHtml = timeGridMethods.renderHeadIntroHtml;
        gridSubclass.renderHeadDateCellHtml = timeGridMethods.renderHeadDateCellHtml;

        return gridSubclass;
    	},

      buildGotoAnchorHtml: function(gotoOptions, attrs, innerHtml) {
        var html = AgendaView.prototype.buildGotoAnchorHtml.apply(this, arguments);

        return basicMethods.buildGotoAnchorHtml(html);
      }
    });

    AccessibleListView = ListView.extend({ // make a subclass of View
      initialize: function() {
        ListView.prototype.initialize.apply(this, arguments);
        // At this point we have this.grid (ListViewGrid) which we can bend to our will
        this.grid.dayHeaderHtml = listGridMethods.dayHeaderHtml;
        this.grid.fgSegHtml = listGridMethods.fgSegHtml;
      },

      onEventsRender: function() {
        // None of our tables are data grids so let the screen read know these are all layout tables
        $('table', this.el).attr('role', 'presentation');
        ListView.prototype.onEventsRender.apply(this, arguments);
    	},

      buildGotoAnchorHtml: function(gotoOptions, attrs, innerHtml) {
        var html = ListView.prototype.buildGotoAnchorHtml.apply(this, arguments);

        return basicMethods.buildGotoAnchorHtml(html);
      }
    });

    // General methods used by multiple view/grids.
    var basicMethods = {
      renderHeadDateCellHtml: function(html, hiddenHtml) {
        // Sneak in full name for screen readers
        html = html.replace('<a', '<a aria-label="' + hiddenHtml + '" ' );
        html = html.replace('<span', '<span aria-label="' + hiddenHtml + '" ' );
        // We cannot have any TH elements  or a screen reader will see the table as a data grid.
        html = html.replace(/<th/g, '<td style="text-align: center;font-weight: bold;" ').replace(/<\/th>/g, '</td>');

        return html;
      },

      buildGotoAnchorHtml: function(html) {
        var position = html.indexOf('>');

        // Just adding a tabindex. We want the tabindes regardless if span or a.
        return html.substr(0, position) + ' tabindex="0"' + html.substr(position);
      }
    };

    var listGridMethods = {
      dayHeaderHtml: function(dayDate) {
        // We want to only have 1 link
        var view = this.view;
    		var mainFormat = view.opt('listDayFormat');
    		var altFormat = view.opt('listDayAltFormat');
        var gotoLink = view.buildGotoAnchorHtml(
          dayDate,
          { 'class': 'fc-list-heading-main' },
          FC.htmlEscape(dayDate.format(mainFormat)) // inner HTML
        );
        gotoLink = gotoLink.replace('<a', '<a aria-label="' + FC.htmlEscape(dayDate.format(mainFormat)) + '" ' );
        gotoLink = gotoLink.replace('<span', '<span aria-label="' + FC.htmlEscape(dayDate.format(mainFormat)) + '" ' );

    		return '<tr class="fc-list-heading" data-date="' + dayDate.format('YYYY-MM-DD') + '">' +
    			'<td class="' + view.widgetHeaderClass + '" colspan="3">' +
    				(mainFormat ?
    					gotoLink :
    					'') +
    				(altFormat ?
              '<span tabindex="0" class="fc-list-heading-alt" aria-label="' + FC.htmlEscape(dayDate.format(altFormat)) + '">' +
    						FC.htmlEscape(dayDate.format(altFormat)) +
              '</span>'
    					 :
    					'') +
    			'</td>' +
    		'</tr>';
      },

      fgSegHtml: function(seg) {
        var linkRole = '';
        var html = ListViewGrid.prototype.fgSegHtml.apply(this, arguments);
        // Determine if the use can click on this event, if so, let screen readers know
        if (this.view.opt('eventClick')) {
          linkRole = 'role="link"';
        }

        // For testing, ensuring AM and PM are upper case,
        // Remove this code if it does not help JAWS read AM and PM
        /*
        var firstPosition = html.indexOf('fc-list-item-time');
        var startPosition = -1;
        var endPosition = -1;
        if (firstPosition > -1) {
          startPosition = html.indexOf('>', firstPosition);
          endPosition = html.indexOf('<', firstPosition);
          html = html.replace(html.substring((startPosition+1), endPosition), html.substring((startPosition+1), endPosition).toUpperCase());
        }
        */

        html = '<tr ' + linkRole + ' tabindex="0" ' + html.substring(3);
        if (seg.event.source && seg.event.source.eventType) {
          html = html.replace(/\<span/g, '<span aria-label="' + FC.htmlEscape(seg.event.source.eventType) + '" ');
        }

        return html;
      }
    };

    var timeGridMethods = {
      fgSegHtml: function(seg, disableResizing) {
        var html = TimeGrid.prototype.fgSegHtml.apply(this, arguments);
        var event = seg.event;
        var view = this.view;
        var timeText;
        var titleHtml;
        var safeTitle = '';

        if (html) {
          if (seg.event.source && seg.event.source.eventType) {
            if (view.isMultiDayEvent(event)) { // if the event appears to span more than one day...
        			if (seg.isStart || seg.isEnd) {
        				timeText = this.getEventTimeText(seg);
        			}
        		} else {
        			// Display the normal time text for the *event's* times
        			timeText = this.getEventTimeText(event);
        		}
            titleHtml = FC.htmlEscape(event.title) || '';

            if(this.isRTL) {
              safeTitle = ' aria-label="' + titleHtml +' ' + timeText + ' ' +  FC.htmlEscape(seg.event.source.eventType) + '" ';
            } else {
              safeTitle = ' aria-label="' + FC.htmlEscape(seg.event.source.eventType) +' ' + timeText + ' ' + titleHtml + '" ';
            }
          }

          html = '<a tabindex="0" ' + safeTitle + html.substring(2);
        }

        return html;
      },

      renderHeadIntroHtml: function() {
        var html = TimeGrid.prototype.renderHeadIntroHtml.apply(this, arguments);
        // Change TH's to TD's and add a role.
        if (html.indexOf('fc-week-number') == -1) {
          html = '<td role="presentation" ' + html.substring(3);
          html = html.substring(0, html.length-2) + 'd>';
        }

        return html;
      },

      renderHeadDateCellHtml: function(date, colspan, otherAttrs) {
        var html = TimeGrid.prototype.renderHeadDateCellHtml.apply(this, arguments);
        var hiddenHtml = FC.htmlEscape(date.format('dddd, MMMM D')); // Saturday (Full name)

        return basicMethods.renderHeadDateCellHtml(html, hiddenHtml);
      }
    };

    // Methods that will customize the rendering behavior of the BasicView's dayGrid
    var basicDayGridMethods = {

      renderNumberCellHtml: function(date) {
        var html = DayGrid.prototype.renderNumberCellHtml.apply(this, arguments);
        // We want to add an aria-label on each month number so it reads the full date.
        var hiddenHtml = FC.htmlEscape(date.format('MMMM D YYYY'));
        html = html.replace('tabindex="0">', 'aria-label="' + hiddenHtml + '" tabindex="0">');

        return html;
      },

      renderHeadHtml: function() {
        var html = DayGrid.prototype.renderHeadHtml.apply(this, arguments);

        return basicMethods.renderHeadHtml(html);
      },

      renderHeadDateCellHtml: function(date, colspan, otherAttrs) {
        var html = DayGrid.prototype.renderHeadDateCellHtml.apply(this, arguments);
        var hiddenHtml = FC.htmlEscape(date.format('dddd')); // Saturday (Full name)

        return basicMethods.renderHeadDateCellHtml(html, hiddenHtml);
      },

      fgSegHtml: function(seg, disableResizing) {
        var event = seg.event;
        var timeText;
    		var titleHtml;
        var safeTitle = '';
        var html = DayGrid.prototype.fgSegHtml.apply(this, arguments);

        if (html) {
          if (seg.event.source && seg.event.source.eventType) {
            timeText = timeText = this.getEventTimeText(event);
            titleHtml = FC.htmlEscape(event.title) || '';
            if(this.isRTL) {
              safeTitle = ' aria-label="' + titleHtml +' ' + timeText + ' ' +  FC.htmlEscape(seg.event.source.eventType) + '" ';
            } else {
              safeTitle = ' aria-label="' + FC.htmlEscape(seg.event.source.eventType) +' ' + timeText + ' ' + titleHtml + '" ';
            }
            //safeTitle = ' aria-label="' + FC.htmlEscape(seg.event.source.eventType) + '" ';
          }
          html = '<a tabindex="0" ' + safeTitle + html.substring(2);
        }

        return html;
      },

      /*
       * Add a tabindex and keypress to make more accessible.
       */
      renderMoreLink: function(row, col, hiddenSegs) {
        var el = DayGrid.prototype.renderMoreLink.apply(this, arguments);
        el.attr('tabindex', 0);
        // Only add if has popup.
        var clickOption = this.view.opt('eventLimitClick');
        if (clickOption === 'popover') {
          el.attr('aria-haspopup', true);
        }
        el.keypress(function(e){
          if(e.which == 13 || e.which == 32){//Enter or spacebarkey pressed
            this.click();
          }
        });

        return el;
      },

      showSegPopover: function(row, col, moreLink, segs) {
        var view = this.view;
        var dialog = $('.hed-cal-dialog', this.el.parents('hed-calendar'));
        var dialogBody = $('.hed-cal-dialog .oj-dialog-body', this.el.parents('hed-calendar'));
        var title = this.getCellDate(row, col).format(view.opt('dayPopoverFormat'));
        var newContent = this.renderSegPopoverContent(row, col, segs);
        // Remove header, we do not need it, we have our own
        //newContent.children('div:first').remove();
        // Remove did not work so we went nuclear.
        newContent.splice(0, 1);

        // Clear previous content and add new.
        dialogBody.empty().append(newContent);

        dialog.ojDialog( "option", "title", title);
        dialog.ojDialog("open");
      },

      limitRow: function(row, levelLimit) {
        DayGrid.prototype.limitRow.apply(this, arguments);
        // Mark Cells/Rows that are hidded as presentation
        var rowStruct = this.rowStructs[row];
        var tdEl = $('tr.fc-limited td.fc-event-container', rowStruct.tbodyEl);
        tdEl.attr('role', 'presentation');
        tdEl.parent().attr('role', 'presentation');
      }
    };

    // Define our new views
    FC.views.AccessibleMonthView = {
    	'class': AccessibleMonthView,
    	duration: { months: 1 }, // important for prev/next
    	defaults: {
    		fixedWeekCount: true
    	}
    }; // register our class with the view system

    FC.views.AccessibleDayAgendaView = {
      'class': AccessibleDayAgendaView,
      duration: { days: 1 },
    	defaults: {
    		allDaySlot: true,
    		slotDuration: '00:30:00',
    		slotEventOverlap: true // a bad name. confused with overlap/constraint system
    	}
    }; // register our class with the view system

    FC.views.AccessibleWeekAgendaView = {
      type: 'AccessibleDayAgendaView',
    	duration: { weeks: 1 }
    }; // register our class with the view system

    FC.views.AccessibleList = {
    	'class': AccessibleListView,
    	buttonTextKey: 'list', // what to lookup in locale files
    	defaults: {
    		buttonText: 'list', // text to display for English
    		listDayFormat: 'LL', // like "January 1, 2016"
    		noEventsMessage: 'No events to display'
    	}
    }; // register our class with the view system

    FC.views.AccessibleListDay = {
    	type: 'AccessibleList',
    	duration: { days: 1 },
    	defaults: {
    		listDayAltFormat: 'dddd' // day-of-week is nice-to-have
    	}
    }; // register our class with the view system

    FC.views.AccessibleListWeek = {
    	type: 'AccessibleList',
    	duration: { weeks: 1 },
    	defaults: {
    		listDayAltFormat: 'dddd' // day-of-week is nice-to-have
    	}
    }; // register our class with the view system

    FC.views.AccessibleListMonth = {
    	type: 'AccessibleList',
    	duration: { month: 1 },
    	defaults: {
    		listDayAltFormat: 'dddd' // day-of-week is nice-to-have
    	}
    }; // register our class with the view system

    FC.views.AccessibleListYear = {
    	type: 'AccessibleList',
    	duration: { year: 1 },
    	defaults: {
    		listDayAltFormat: 'dddd' // day-of-week is nice-to-have
    	}
    }; // register our class with the view system
  }
);
