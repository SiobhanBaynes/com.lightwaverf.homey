'use strict'

function getCommand(data) {
    switch (data.command) {
        case 0:
            if (data.parameter < 128)
                return { cmd: 'turn_off' };
            if (data.parameter < 160)
                return { cmd: 'dim_value', value: (data.parameter & 0x1F) / 31 };
            if (data.parameter < 192)
                return { cmd: 'dim_decrease' };
            return { cmd: 'turn_off_group' };
        case 1:
            if (data.parameter < 32)
                return { cmd: 'turn_on' };
            if (data.parameter < 160)
                return { cmd: 'dim_value', value: (data.parameter & 0x1F) / 31 };
            if (data.parameter < 192)
                return { cmd: 'dim_increase' };
            return { cmd: 'dim_value_group', value: (data.parameter & 0x1F) / 31 };
        case 2:
            if (data.parameter < 128)
                return { cmd: 'define_mood', value: data.parameter - 1 };
            return { cmd: 'start_mood', value: (data.parameter & 0x7F) - 1 };
        default:
            break;
    }
    return null;
}

function setOnOff(device_data, onoff) {
    const data = Object.assign({}, device_data);

    data.command = onoff ? 1 : 0;
    data.parameter = onoff ? 0 : 64;
    return data;
}

function setDim(device_data, dim_percent) {
    const data = Object.assign({}, device_data);

    data.command = 1;
    data.parameter = Math.round(dim_percent * 31) + 192;

    return data;
}

function setMood(device_data, mood) {
    const data = Object.assign({}, device_data);

    data.command = 2;
    data.parameter = mood + 1;
    data.unit = 4;
    data.channel = 4;

    return data;
}

module.exports = RFDevice => class LightwaveRFDevice extends RFDevice {

    static generateData() {
        const data = {
            parameter: 0,
            channel: Math.round(Math.random()*4),
            unit: Math.round(Math.random()*4),
            command: 1,
            transID: 'f5547', // need to generate this but no idea how
            subID: Math.round(Math.random()*8),
            onoff: true,
            state: false
        }
        data.id = `${data.transID}:${data.unit}`
        return data;
    }

    static payloadToData(payload) {
        const data = {
            parameter: payload[0] << 4 + payload[1],
            channel: Math.floor(payload[2] / 4) + 1,
            unit: (payload[2] % 4) + 1,
            command: payload[3],
            transID: payload.slice(4, 9).map(num => num.toString(16)).join(''),
            subID: payload[9],
        };

        data.state = data.command;
        data.onff = !!data.command;
        data.id = `${data.transID}:${data.unit}`

        console.log('created data', data);
        return data;
    }

    static dataToPayload(data) {
        if (data.onoff == true || data.onoff == false) {
            data = setOnOff(data, data.onoff);
        }
        
        if (!isNaN(data.dim)) {
            data = setDim(data, data.dim);
        }
        
        let payload = [];
    
        console.log('data before payload', data);

        payload.push((data.parameter >> 4) & 0xF);
        payload.push(data.parameter & 0xF);
        payload.push((data.channel * 4 + data.unit - 5) & 0xF);
        payload.push(data.command & 0xF);
        payload.push(...data.transID.split('').map(n => parseInt(n, 16) & 0xF));
        payload.push(data.subID & 0xF);
    
        return payload;
    }
}