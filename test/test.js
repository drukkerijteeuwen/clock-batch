/* global require */
var should = require('chai').should(),
    clockBatch = require('../lib/index')();

describe('#add', function() {
	"use strict";
  	it('add a item', function() {
		clockBatch.add(4000, function(){}, this, {}, "number").should.be.an("object");
	});
});