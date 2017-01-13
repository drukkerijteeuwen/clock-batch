clock-batch
========
Version 0.1.0


A custom batch timer to send push notifications to iPhone and Android



## Installation

```bash
$ npm install clock-batch
```

## API

Batch can also be included on any project and used programmatically.

### `add(delay, callback, callbackContext, options, type)`

- `delay` - The number of milliseconds or a timestamp
- `callback` - The callback that will be called when the timer event occurs.
- `callbackContext` - The context in which the callback will be called.
- `options` - The values to be sent to your callback function when it is called.
- `type` - The type of delay is used a number or a date


### `remove(event)`

- `event` - The event to remove from the queue.

## Use:

```js
// Load the module
var batch = require('clock-batch');

// Set the options
var options = {"taskName": "Test", "date": "06-01-2017", "time": "11:13"};

// For adding a event
var event = batch.add(4000, sendPush, options, "number");

// For removing a event
batch.remove(event);

```

## License

Peter Donders - Drukkerij Teeuwen
