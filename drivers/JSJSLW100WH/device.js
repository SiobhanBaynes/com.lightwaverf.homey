'use strict';

const Remote = require('../../lib/LightwaveRFDevice');

// To extend from another class change the line below to
// module.exports = RFDevice => class 50970RDevice extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class JSJSLW100WHDevice extends Remote(RFDevice) {};