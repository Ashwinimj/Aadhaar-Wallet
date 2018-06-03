/**
  Copyright (c) 2015, 2017, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcore', 'text!./ojsample-calendar-view.html', './ojsample-calendar-viewModel',
    'text!./component.json',
    'css!./lib/fullcalendar/dist/fullcalendar.min.css',
    'css!./ojsample-calendar-styles.css',
    'ojs/ojcomposite'],
  function(oj, view, viewModel, metadata) {
    oj.Composite.register('ojsample-calendar',
    {
      metadata: {inline: JSON.parse(metadata)},
      view: {inline: view},
      viewModel: {inline: viewModel}
    });
  }
);