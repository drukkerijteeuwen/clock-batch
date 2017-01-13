/* global module, require*/
/*!
 * clock-batch
 * Copyright(c) 2016-2017 Peter Donders
 */


var mixin = require('merge-descriptors'),
	helpers = require('./application'),
	timer = require('./timer');
/**
 * Expose `createApplication()`.
 */

module.exports = createApplication;

/**
 * Create an application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() 
{
	"use strict";
  	var app = function() {
   		this.running = false;
  	};

 	mixin(app, helpers, false);
	mixin(app, timer, false);
	
	app.init();
  	return app;
}

