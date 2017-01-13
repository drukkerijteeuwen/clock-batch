/*global module */
var app = module.exports = {};

/**
 * @property {number} _i - Temp. array counter variable.
 * @private
 */
app._i = 0;

/**
 * @property {number} _newTick - Internal cache var.
 * @private
 */
app._newTick = 0;

/**
 * @property {number} nextTick - The time the next tick will occur.
 * @readonly
 * @protected
 */
app.nextTick = 0;

/**
 * @property {number} _diff - Internal cache var.
 * @private
 */
app._diff = 0;

/**
 * @property {number} _marked - Temp. counter variable.
 * @private
 */
app._marked = 0;

/**
 * Starts this Timer running.
 * @method app#start
 * @param {integer} [delay=0] - The number of milliseconds, that should elapse before the Timer will start.
 */
app.start = function (delay) {
	"use strict";
	if (this.running)
	{
		return;
	}
	
	this._started = this.time + (delay || 0);

	this.running = true;

	for (var i = 0; i < this.events.length; i++)
	{
		this.events[i].tick = this.events[i].delay + this._started;
	}
	
	var _this = this;
	
	this._onLoop = function () {
		return _this.updateSetTimeout();
	};

	this._timeOutID = setTimeout(this._onLoop, 0);
};

/**
 * The update method for the setTimeout.
 * @method app#updateSetTimeout
 */
app.updateSetTimeout = function() {
	"use strict";
	if (this.running)
	{
		this.update(Date.now());

		this._timeOutID = setTimeout(this._onLoop, this.timeToCall);
	}
};

/**
 * Updates the clock and if enabled the advanced timing data. This is called automatically
 *
 * @method app#update
 * @protected
 * @param {number} time - The current relative timestamp.
 */
app.update = function (time) {
	"use strict";
	
	//  Set to the old Date.now value
	var previousDateNow = this.time;

	// this.time always holds a Date.now value
	this.time = Date.now();

	//  Adjust accordingly.
	this.elapsedMS = this.time - previousDateNow;

	// 'now' is currently still holding the time of the last call, move it into prevTime
	this.prevTime = this.now;

	// update 'now' to hold the current time
	// this.now may hold the RAF high resolution time value if RAF is available (otherwise it also holds Date.now)
	this.now = time;

	// elapsed time between previous call and now - this could be a high resolution value
	this.elapsed = this.now - this.prevTime;

	 //console.log('Time isSet', this._desiredFps, 'te', this.timeExpected, 'time', time);

	// time to call this function again in ms in case we're using timers instead of RequestAnimationFrame to update the game
	this.timeToCall = Math.floor(Math.max(0, (1000.0 / this._desiredFps) - (this.timeExpected - time)));

	// time when the next call is expected if using timers
	this.timeExpected = time + this.timeToCall;

	 //console.log('Time expect', this.timeExpected);
	

	if (this.advancedTiming)
	{
		this.updateAdvancedTiming();
	}

	//  Our internal Timer
	this.eventUpdate(this.time);

		
};

/**
 * The main Timer update event, called automatically by app.update.
 *
 * @method app#eventUpdate
 * @protected
 * @param {number} time - The time from the core clock.
 * @return {boolean} True if there are still events waiting to be dispatched, otherwise false if this Timer can be destroyed.
 */
app.eventUpdate = function(time) {
	
	"use strict";
	this.elapsed = time - this._now;
    this._now = time;

	//  spike-dislike
    if (this.elapsed > this.timeCap)
	{
		//  For some reason the time between now and the last time the game was updated was larger than our timeCap.
		//  This can happen if the Stage.disableVisibilityChange is true and you swap tabs, which makes the raf pause.
		//  In this case we need to adjust the TimerEvents and nextTick.
		this.adjustEvents(time - this.elapsed);
	}

	this._marked = 0;

	//  Clears events marked for deletion and resets _len and _i to 0.
	this.clearPendingEvents();

	if (this.running && this._now >= this.nextTick && this._len > 0) 
	{
		while (this._i < this._len && this.running)
		{
			if (this._now >= this.events[this._i].tick && !this.events[this._i].pendingDelete)
			{
				//  (now + delay) - (time difference from last tick to now)
				this._newTick = (this._now + this.events[this._i].delay) - (this._now - this.events[this._i].tick);

				if (this._newTick < 0)
				{
					this._newTick = this._now + this.events[this._i].delay;
				}

				this._marked++;
				this.events[this._i].pendingDelete = true;
				console.log(this.events);
				this.events[this._i].callback.apply(null, this.events[this._i].options);
				
				this._i++;
			}
			else
			{
				break;
			}
		}

		//  Are there any events left?
		if (this.events.length > this._marked)
		{
			this.order();
		}
		else
		{
			this.expired = true;
		}
	}

	if (this.expired && this.autoDestroy)
	{
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * Clears any events from the Timer which have pendingDelete set to true and then resets the private _len and _i values.
 *
 * @method app#clearPendingEvents
 * @protected
 */
app.clearPendingEvents = function () {
	"use strict";
	this._i = this.events.length;

	while (this._i--)
	{
		if (this.events[this._i].pendingDelete)
		{
			this.events.splice(this._i, 1);
		}
	}

	this._len = this.events.length;
	this._i = 0;
};
