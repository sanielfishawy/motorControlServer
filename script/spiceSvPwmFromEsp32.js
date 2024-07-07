import FS from 'fs'
import fetch from "node-fetch"
import {Pulse} from "./spiceSvPwm2.js"

// Run test_http on esp32 to connect http server to wifi

async function getEspPulseData(){
    var url = "http://motor.local/svPwm"
    const r = await fetch(url)
    const j = await r.json()
    return j.results
}

async function getPulses(){
    const espPulses = await getEspPulseData()
    const numCycles = 5
    const sinPeriod = 10000.0
    const pwmPeriod = 100.0

    let aHi = ''
    let aLo = ''
    let bHi = ''
    let bLo = ''
    let cHi = ''
    let cLo = ''

    let startTs = 0

    for (let i=0; i<numCycles; i++){
        for (const entry of espPulses){

            const aEdgeTs = (entry.aEdge * pwmPeriod) + startTs
            const aPw = entry.aPw * pwmPeriod
            const aPulse = new Pulse(startTs, aEdgeTs, aPw, pwmPeriod)

            const bEdgeTs = (entry.bEdge * pwmPeriod) + startTs
            const bPw = entry.bPw * pwmPeriod
            const bPulse = new Pulse(startTs, bEdgeTs, bPw, pwmPeriod)

            const cEdgeTs = (entry.cEdge * pwmPeriod) + startTs
            const cPw = entry.cPw * pwmPeriod
            const cPulse = new Pulse(startTs, cEdgeTs, cPw, pwmPeriod)
            
            aHi += aPulse.pulseHi
            aLo += aPulse.pulseLo
            bHi += bPulse.pulseHi
            bLo += bPulse.pulseLo
            cHi += cPulse.pulseHi
            cLo += cPulse.pulseLo

            startTs += pwmPeriod
        }
    }

    await FS.promises.writeFile('data/aHi.pwm', aHi, 'utf8')
    await FS.promises.writeFile('data/aLo.pwm', aLo, 'utf8')
    await FS.promises.writeFile('data/bHi.pwm', bHi, 'utf8')
    await FS.promises.writeFile('data/bLo.pwm', bLo, 'utf8')
    await FS.promises.writeFile('data/cHi.pwm', cHi, 'utf8')
    await FS.promises.writeFile('data/cLo.pwm', cLo, 'utf8')
}


async function printEspPulseData(){
    const espPulses = await getEspPulseData()
    let i = 0
    for (const entry of espPulses){

        console.log({i, entry})
        i++
    }
}

// await printEspPulseData()
await getPulses()