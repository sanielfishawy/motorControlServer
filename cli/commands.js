#!/usr/bin/env node

import util from 'util'
import {program} from 'commander'
import * as MApi from '../api/Esp32MotorApi.js'

function runCli(){
    let c = program.command('getFreq')
    c.action( async (options) => {await handleGetFreq(options)})

    c = program.command('getAmp')
    c.action( async (options) => {await handleGetAmp(options)})

    c = program.command('setFreq <freq>')
    c.action( async (freq, options) => {await handleSetFreq(freq, options)})

    c = program.command('setAmp <amp>')
    c.action( async (amp, options) => {await handleSetAmp(amp, options)}) 

    c = program.command('setActive')
    c.action( async (options) => {await handleSetActive(options)})

    c = program.command('setFloat')
    c.action( async (options) => {await handleSetFloat(options)})
    
    c = program.command('getIsActive')
    c.action( async (options) => {await handleGetIsActive(options)})

    program.parse(process.argv)
}

async function handleGetFreq(options){
    printResponse(await MApi.getFreqHz())
}

async function handleGetAmp(options){
    printResponse(await MApi.getAmplitudeFract())
}

async function handleSetFreq(freq, options){
    printResponse(await MApi.setFreqHz(freq))
}

async function handleSetAmp(amp, options){
    printResponse(await MApi.setAmplitudeFract(amp))
}

async function handleSetActive(options){
    printResponse(await MApi.setActive())
}

async function handleSetFloat(options){
    printResponse(await MApi.setFloat())
}   

async function handleGetIsActive(options){
    printResponse(await MApi.getIsActive())
}

async function printResponse(r){
    const j = await r.json()
    return console.log(util.inspect(j, false, null, true))
}

runCli()