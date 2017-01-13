/* global module */
/**
* A TimerEvent is a single event that is processed by a Timer.
*
* It consists of a delay, which is a value in milliseconds after which the event will fire.
* When the event fires it calls a specific callback with the specified arguments.
* 
* TimerEvents are removed by their parent timer once finished firing
* 
* Use {@app#add} method to create a new event.
*
* @class TimerEvent
* @constructor
* @param {number} delay - The delay in ms at which this TimerEvent fires.
* @param {number} tick - The tick is the next game clock time that this event will fire at.
* @param {function} callback - The callback that will be called when the TimerEvent occurs.
* @param {object} callbackContext - The context in which the callback will be called.
* @param {any[]} options - Additional arguments to be passed to the callback.
*/

module.exports = TimerEvent;


function TimerEvent(delay, tick, callback, callbackContext, options) 
{
	"use strict";
	
	/**
     * @property {number} delay - The delay in ms at which this TimerEvent fires.
     */
	this.delay = delay;
	
	/**
     * @property {number} tick - The tick is the next plugin clock time that this event will fire at.
     */
	this.tick = tick;
	
	 /**
     * @property {function} callback - The callback that will be called when the TimerEvent occurs.
     */
	this.callback = callback;
	
	/**
     * @property {object} callbackContext - The context in which the callback will be called.
     */
	this.callbackContext = callbackContext;
	
	/**
     * @property {any[]} options - Additional arguments to be passed to the callback.
     */
	this.options = options;
	
	/**
     * @property {boolean} pendingDelete - A flag that controls if the TimerEvent is pending deletion.
     * @protected
     */
	this.pendingDelete = false;
}

