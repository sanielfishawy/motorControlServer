import * as FS from 'fs'

const timeUnit = 'us'
const voltUnit = 'V'
const hiVolt = 15
const hiV = `${hiVolt}${voltUnit}`
const loV = `0${voltUnit}`
const pwmPeriod = 100
const sinPeriod = 10000
const pwmPeriodsPerSinPeriod = sinPeriod / pwmPeriod
const numCycles = 3
const numPwmPeriods = numCycles * sinPeriod / pwmPeriod

export function getValue(tick, phaseOffsetRad=0){
    const fract = (1.0 * tick % pwmPeriodsPerSinPeriod) / pwmPeriodsPerSinPeriod
    const phaseRad = fract * 2 * Math.PI
    return Math.sin(phaseRad + phaseOffsetRad)
}

export function getPulse(tick, phaseOffsetRad=0){
    let val = getValue(tick, phaseOffsetRad)
    const nextPeriodStart = pwmPeriod * (tick + 1)

    const side = val > 0 ? 'hi' : 'lo'

    const periodStartTs = tick * pwmPeriod
    const periodStartEntry = getPwmEntry(periodStartTs, loV)

    const riseStartTs = periodStartTs + .1
    const riseStartEntry = getPwmEntry(riseStartTs, loV)

    const riseEndTs = riseStartTs + .1
    const riseEndEntry = getPwmEntry(riseEndTs, hiV)
    
    let fallStartTs = riseEndTs + Math.abs(val) * pwmPeriod
    let fallEndTs = fallStartTs + .1

    if (fallStartTs > nextPeriodStart) {
        fallStartTs = nextPeriodStart - 0.2
        fallEndTs = nextPeriodStart - 0.1
    }

    const fallStartEntry = getPwmEntry(fallStartTs, hiV)
    const fallEndEntry = getPwmEntry(fallEndTs, loV)

    return {
        side,
        pwm: periodStartEntry + riseStartEntry + riseEndEntry + fallStartEntry + fallEndEntry 
    }
}

export function getPwmEntry(ts, hiVLoV){
    return `${ts}${timeUnit} ${hiVLoV}\n`
}

export function getPulses(side, phaseOffsetRad=0){
    let r = ''
    for(let tick=0; tick < numPwmPeriods; tick++){
        const pulse = getPulse(tick, phaseOffsetRad)
        if (side == pulse.side) r += pulse.pwm
    }
    return r
}

export async function getAndSaveAll(){
    const phaseBRad = 2 * Math.PI / 3
    const phaseCRad = 4 * Math.PI / 3
    const aHi = getPulses('hi')
    const aLo = getPulses('lo')
    const bHi = getPulses('hi', phaseBRad)
    const bLo = getPulses('lo', phaseBRad)
    const cHi = getPulses('hi', phaseCRad)
    const cLo = getPulses('lo', phaseCRad)

    await FS.promises.writeFile('data/aHi.pwm', aHi, 'utf8')
    await FS.promises.writeFile('data/aLo.pwm', aLo, 'utf8')
    await FS.promises.writeFile('data/bHi.pwm', bHi, 'utf8')
    await FS.promises.writeFile('data/bLo.pwm', bLo, 'utf8')
    await FS.promises.writeFile('data/cHi.pwm', cHi, 'utf8')
    await FS.promises.writeFile('data/cLo.pwm', cLo, 'utf8')
}

await getAndSaveAll()