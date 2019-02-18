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
		
	async onFlowTriggerFrameReceived(args, state) {

		if(state.command === 0 && state.parameter === 0 ) return false;

		//don't trigger 4 when using group command
		if(args.unit === '4' && state.parameter === 192) return false;

		//handle group button
		if(args.unit === 'group' && state.unit === 4 && state.channel === 4 && state.parameter === (args.command === '1' ? 512 : 192))
			return true;


		return super.onFlowTriggerFrameReceived(args, state);
	}
}