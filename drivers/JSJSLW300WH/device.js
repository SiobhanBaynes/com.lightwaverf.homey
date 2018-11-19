'use strict';

const Socket = require('../../lib/LightwaveRFDevice');

module.exports = RFDevice => class JSJSLW300WHDevice extends Socket(RFDevice) {
};
