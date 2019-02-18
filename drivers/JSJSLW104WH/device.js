'use strict';

const Remote = require('../../lib/devices/remote');

// To extend from another class change the line below to
// module.exports = RFDevice => class 50970RDevice extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class JSJSLW104WHDevice extends Remote(RFDevice) {

    async onFlowTriggerFrameReceived(args, state) {

		if(state.command === 0 && state.parameter === 0 ) return false;

        const [key, cmd] = (args.button || '').split('_');

        switch(key) {
            case 'mood':
                return state.channel === 4 && state.unit === 4 && state.command === 2 && state.parameter === (256 << parseInt(cmd));
            case 'power':
                return state.channel === 4 && state.unit === 4 && state.command === 0 && state.parameter === 192;
            default:
                return state.channel === 1 && state.unit === Number(key) && state.onoff === (cmd === 'on');
        }
    }
};
