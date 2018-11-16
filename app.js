'use strict';

const Homey = require('homey');

class LightwaveRF extends Homey.App {
	
	onInit() {
		this.log('Lightwave RF is running...');
	}
	
}

module.exports = LightwaveRF;