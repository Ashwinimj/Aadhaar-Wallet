# Intelligent Bots Chat widget - Oracle JET Composite Component

Version: 2.0.0

This is a sample chat widget that is packaged as an Oracle JET composite component. You can reuse this CCA in your own mobile or web app to provide a custom bot client that connects to the Oracle Intelligent Bots platform using web sockets.

Use this CCA in combination with the sample chat server included with Oracle Intelligent Bots. The chat server uses the Bots Webhook channel and exposes the web socket connection used by this CCA. Go to [Chat Server sample](/source/apps/chat/overview) for set-up instructions of the chat server.

This chat widget can be used with JET version 4.0 or higher.

## Installation Steps ##

- If you don’t have an existing JET project where you want to add the CCA, then create a new JET app first, for example using one of the standard templates:

        ojet create [project name] --template=navdrawer

- Create a folder jet-composites under the src/js folder of your JET project

- Unzip the oj-ibsample-chat-widget.zip in this folder

- In the view model of the page where you want to embed the bot client (for example dashboard.js if you used a starter template), add the following entry to the define block:

        jet-composites/oj-ibsample-chat-widget/loader

- In the same view model, add the following code (right after the 'var self = this' line if you used  dashboard.js from starter template):

        self.websocketConnectionUrl = 'ws://your_bots_samples_host:8888/ext/chat/apps/ws';
        self.userId = 'your userId used to send message to the bot';
        self.channel = 'channelId, copy from your webhook definition';

- In your html view (dashboard.html when using the starter template), add these lines:

        <oj-ibsample-chat-widget
            channel="[[channel]]"
            websocket-connection-url="[[websocketConnectionUrl]]"
            user-id="[[userId]]"
            id="chat-widget">
        </oj-ibsample-chat-widget>

### Resizing the chat widget ###
You can change the height of the widget by changing the height property of oj-ibsample-chat-widget class in styles.css.

### Optional ###
If you want to clear the message history and/or apply new values for websocket connection, user ID, or channel ID, you can can create the following method in in your app (e.g in dashboard.js) that calls the CCA start method as follows:

        self.reset = function() {
            var ccaNode = $('#chat-widget');
            ccaNode[0].reset();              
        }

You can then call this reset function from some button:

        <button id="reset" data-bind="click: reset ,ojComponent: {component: 'ojButton', label: 'Reset'}"> </button>
