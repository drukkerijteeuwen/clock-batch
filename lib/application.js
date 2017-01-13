/* global require, module */

var TimerEvent = require('./timerevent');

var app = module.exports = {};

/**
 * @property {TimerEvent[]} events - An array holding all of this timers TimerEvent objects. 
 * Use the methods add, to populate it.
*/
app.events = [];

/**
 * The desired frame rate of the plugin.
 * This is used is used to calculate the physic/logic multiplier and how to apply catch-up logic updates.
 *
 * @property {number} _desiredFps
 * @private
 * @default
 */
app._desiredFps = 60;

/**
 * If true then advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated.
 * @property {boolean} advancedTiming
 * @default
 */
app.advancedTiming = false;

/**
 * @property {number} _started - The time at which the plugin instance started.
 * @private
 */
app._started = 0;

/**
 * The `Date.now()` value when the time was last updated.
 * @property {integer} time
 * @protected
 */
app.time = 0;

/**
 * @property {number} _now - The current start-time adjusted time.
 * @private
*/
app._now = Date.now();

/**
 * @property {function} _onLoop - The function called by the update.
 * @private
 */
app._onLoop = null;

/**
 * @property {number} _timeOutID - The callback ID used when calling cancel.
 * @private
 */
app._timeOutID = null;

/**
 * @property {number} timeExpected - The time when the next call is expected when using setTimer to control the update loop
 * @protected
*/
app.timeExpected = 0;


/**
 * Initialize the app.
 *
 *   - setup default configuration
 *
 * @private
 */
app.init = function init() {
	"use strict";
	
	this._started = Date.now();
    this.time = Date.now();
    this.start();
	this.timeExpected = this.time;
};

/**
 * Creates a new TimerEvent on this Timer.
 *
 * @method app#add
 * @param {integer} delay - The number of milliseconds or a timestamp
 * @param {function} callback - The callback that will be called when the timer event occurs.
 * @param {object} callbackContext - The context in which the callback will be called.
 * @param {any[]} options - The values to be sent to your callback function when it is called.
 * @param {string} type - The type of delay is used a number or a date
 * @return {TimerEvent} The TimerEvent object that was created.
 */
app.add = function(delay, callback, callbackContext, options, type) {
	"use strict";
	delay = Math.round(delay);

	var tick = delay;
	
	if (type === "number")
	{
		if (this._now === 0)
		{
			tick += this.time;
		}
		else
		{
			tick += this._now;
		}
	}
	
	var event = new TimerEvent(delay, tick, callback, callbackContext, [options]);

	this.events.push(event);

	this.order();

	this.expired = false;
	return event;
};

/**
 * Orders the events on this Timer so they are in tick order.
 * This is called automatically when new events are created.
 * @method app#order
 * @protected
 */
app.order = function () {
	"use strict";
	if (this.events.length > 0)
	{
		//  Sort the events so the one with the lowest tick is first
		this.events.sort(this.sortHandler);
		this.nextTick = this.events[0].tick;
	}
};

/**
 * Sort handler used by app.order.
 * @method app#sortHandler
 * @private
 */
app.sortHandler = function (a, b) {
	"use strict";

	if (a.tick < b.tick)
	{
		return -1;
	}
	else if (a.tick > b.tick)
	{
		return 1;
	}

	return 0;

};

/**
 * Removes a pending TimerEvent from the queue.
 * @param {TimerEvent} event - The event to remove from the queue.
 * @method app#remove
*/
app.remove = function(event) {
	"use strict";
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i] === event) {
			this.events[i].pendingDelete = true;
			return true;
		}
	}

	return false;
};

