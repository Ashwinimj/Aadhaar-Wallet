define(['ojs/ojcore',
    'text!./view.html',
    './viewModel',
    'text!./component.json',
    'css!./styles',
    'ojs/ojcomposite'],
        function (oj, view, viewModel, metadata) {
            oj.Composite.register('oj-ibsample-chat-widget', {
                view: {inline: view},
                viewModel: {inline: viewModel},
                metadata: {inline: JSON.parse(metadata)}
            });
        }
);