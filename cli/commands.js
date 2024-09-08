#!/usr/bin/env node

import util from 'util'
import {program} from 'commander'
import * as MApi from '../api/esp32MotorApi.js'

function runCli(){
    let c = program.command('getFreq')
    c.action( async (options) => {
        await printResponse(await MApi.getFreqHz(options))
    })

    c = program.command('getAmp')
    c.action( async (options) => { 
        await printResponse(await MApi.getAmplitudeFract(options))
    })

    c = program.command('setFreq <freq>')
    c.action( async (freq, options) => { 
        await printResponse(await MApi.setFreqHz(freq, options))
    })

    c = program.command('setAmp <amp>')
    c.action( async (amp, options) => { 
        await printResponse(await MApi.setAmplitudeFract(amp, options))
    })

    c = program.command('setActive')
    c.action( async (options) => { 
        await printResponse(await MApi.setActive(options))
    })

    c = program.command('setFloat')
    c.action( async (options) => { 
        await printResponse(await MApi.setFloat(options))
    })
    
    c = program.command('getIsActive')
    c.action( async (options) => { 
        await printResponse(await MApi.getIsActive(options))
    })

    c = program.command('status')
    c.action( async (options) => { 
        await printResponse(await MApi.getStatus())
    })

    c = program.command('getGoPedalStatus')
    c.action( async (options) => { 
        await printResponse(await MApi.getGoPedalStatus())
    })

    c = program.command('getTorque')
    c.action( async (options) => {
        await printResponse(await MApi.getTorque())
    })

    c = program.command('setTorque <torque>')
    c.action( async (torque, options) => {
        await printResponse(await MApi.setTorque(torque))
    })

    c = program.command('getUseGoPedal')
    c.action( async (options) => {
        await printResponse(await MApi.getUseGoPedal())
    })

    c = program.command('setUseGoPedal <trueOrFalse>')
    c.action( async (trueOrFalse, options) => {
        await printResponse(await MApi.setUseGoPedal(trueOrFalse))
    })

    c = program.command('setDynamicMeasurement <measurement>')
    c.action ( async (measurement, options) => {
        const m = {
            minFreqHz: 10.5,
            maxFreqHz: 15.5,
            slipFract: 0.1,
            amplitudeFract: 0.5,
        }
        await printResponse(await MApi.setDynamicMeasurement(m))
    })

    c = program.command('getDynamicMeasurement')
    c.action( async (options) => {
        await printResponse(await MApi.getDynamicMeasurement())
    })

    program.parse(process.argv)
}

async function printResponse(r){
    const j = await r.json()
    const formattedObject = JSON.parse(JSON.stringify(j, (key, value) => {
        return typeof value === 'number' ? Number(value.toFixed(3)) : value;
    }));
    console.log(util.inspect(formattedObject, false, null, true))
}

runCli()