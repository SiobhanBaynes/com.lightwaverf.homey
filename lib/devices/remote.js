'use strict';

const LightwaveRF = require('./../LightwaveRFDevice');

module.exports = RFDevice => class Remote extends LightwaveRF(RFDevice) {
    /**
	 * Use the normal data to payload, then strip the unit from the data before returning.
	 * The unit is depending on the button so it will not be unique for a remote.
	 * 
	 * @param {*} payload 
	 */
	static payloadToData(payload) {
		const data = super.payloadToData(payload);
		if (!data) return data;

		data.id = data.transID;
		return data;
    }
}