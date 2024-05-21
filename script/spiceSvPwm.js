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

export function fract0Deg(theta, amp=0.9) {
    const r = ( Math.sqrt(3) * Math.cos(theta) - Math.sin(theta) ) / 2
    return Math.round(r * amp * 1000) / 1000
}

export function fract60Deg(theta, amp=0.9) {
    const r = Math.sin(theta)
    return Math.round(r * amp * 1000) / 1000
}

export function getSectorAndThetaForRad(angleRad){
    const rad = angleRad % (2 * Math.PI)
    const sector = Math.floor(rad / (Math.PI / 3)) + 1
    const theta = rad % (Math.PI / 3)
    return {sector, theta}
}

export class SectorVectors{

    static A_PLUS  = {c:{hi:0, lo:1}, b:{hi:0, lo:1}, a:{hi:1, lo:0}}
    static C_MINUS = {c:{hi:0, lo:1}, b:{hi:1, lo:0}, a:{hi:1, lo:0}}
    static B_PLUS  = {c:{hi:0, lo:1}, b:{hi:1, lo:0}, a:{hi:0, lo:1}}
    static A_MINUS = {c:{hi:1, lo:0}, b:{hi:1, lo:0}, a:{hi:0, lo:1}}
    static C_PLUS  = {c:{hi:1, lo:0}, b:{hi:0, lo:1}, a:{hi:0, lo:1}}
    static B_MINUS = {c:{hi:1, lo:0}, b:{hi:0, lo:1}, a:{hi:1, lo:0}}

    static getSectorVectors(sector){
        switch(sector){
            case 1: return {zeroDeg: SectorVectors.A_PLUS, sixtyDeg: SectorVectors.C_MINUS}
            case 2: return {zeroDeg: SectorVectors.C_MINUS, sixtyDeg: SectorVectors.B_PLUS}
            case 3: return {zeroDeg: SectorVectors.B_PLUS, sixtyDeg: SectorVectors.A_MINUS}
            case 4: return {zeroDeg: SectorVectors.A_MINUS, sixtyDeg: SectorVectors.C_PLUS}
            case 5: return {zeroDeg: SectorVectors.C_PLUS, sixtyDeg: SectorVectors.B_MINUS} 
            case 6: return {zeroDeg: SectorVectors.B_MINUS, sixtyDeg: SectorVectors.A_PLUS} 
        }
    }
}

export function getDwells(angleRad){
    const {sector, theta} = getSectorAndThetaForRad(angleRad)
    const f0Deg = fract0Deg(theta)
    const f60Deg = fract60Deg(theta)
    const sectorVectors = SectorVectors.getSectorVectors(sector)
    
    const offDwell = 1 - f0Deg - f60Deg
    const aHiDwell = sectorVectors.zeroDeg.a.hi * f0Deg + sectorVectors.sixtyDeg.a.hi * f60Deg
    const aLoDwell = sectorVectors.zeroDeg.a.lo * f0Deg + sectorVectors.sixtyDeg.a.lo * f60Deg
    const bHiDwell = sectorVectors.zeroDeg.b.hi * f0Deg + sectorVectors.sixtyDeg.b.hi * f60Deg
    const bLoDwell = sectorVectors.zeroDeg.b.lo * f0Deg + sectorVectors.sixtyDeg.b.lo * f60Deg
    const cHiDwell = sectorVectors.zeroDeg.c.hi * f0Deg + sectorVectors.sixtyDeg.c.hi * f60Deg
    const cLoDwell = sectorVectors.zeroDeg.c.lo * f0Deg + sectorVectors.sixtyDeg.c.lo * f60Deg

    return {f0Deg, f60Deg, offDwell, aHiDwell, aLoDwell, bHiDwell, bLoDwell, cHiDwell, cLoDwell}
}

export function getPulse(tick, offDwell, hiDwell, lowDwell){
    const startTs = tick * pwmPeriod
    const pulseStartTs = startTs + (offDwell * pwmPeriod / 2)
    const hiEndTs = pulseStartTs + (hiDwell * pwmPeriod)

    const r = []
    r.push({ts: startTs, action: 'low'})
    if (hiDwell){
        r.push({ts: pulseStartTs, action: 'rise'})
        r.push({ts: hiEndTs, action: 'fall'})
    }
    
    if (lowDwell){
        if (hiDwell) r.push({ts: hiEndTs, action: 'fall'})
        else r.push({ts: hiEndTs, action: 'low'})
    }

    return [
        [
            {ts: pulseStartTs , action: 'low'},
        ]
    ]
}


export class Pulse{
    static RISE_TIME = 0.1
    static FALL_TIME = 0.1

    constructor(startTs, riseTs, fallTs, invert=false){
        this.startTs = Math.round(startTs * 10) / 10
        this.riseTs  = Math.round(riseTs * 10) / 10
        this.fallTs  = Math.round(fallTs * 10) / 10
        this.invert  = invert
    }

    getPulse(){
        let r = ''

        if (!this.invert){
            r += this.getEntryLo( this.startTs)
            if(!this.riseTs) return r
            r += this.getEntryRise(this.riseTs)
            r += this.getEntryFall(this.fallTs)
            return r
        }

        r += this.getEntryHi(this.startTs)
        if(!this.riseTs) return r
        r += this.getEntryFall(this.riseTs)
        r += this.getEntryRise(this.fallTs)
        return r
    }

    getEntryLo(ts){
        return `${ts}${timeUnit} ${loV}\n`
    }

    getEntryHi(ts){
        return `${ts}${timeUnit} ${hiV}\n`
    }

    getEntryFall(ts){
        return `${ts}${timeUnit} ${hiV}\n${ts + Pulse.FALL_TIME}${timeUnit} ${loV}\n`
    }

    getEntryRise(ts){
        ts = Math.round(ts * 10) / 10
        return `${ts}${timeUnit} ${loV}\n${ts + Pulse.RISE_TIME}${timeUnit} ${hiV}\n`
    }

}

export async function getPulses(tick, angleRad){
    const dwells = getDwells(angleRad)
    const aHi= getPulse(tick, dwells.offDwell, dwells.aHiDwell, dwells.aLoDwell)
    const aLo= getPulse(tick, dwells.offDwell, dwells.aHiDwell, dwells.aLoDwell, true)
    const bHi= getPulse(tick, dwells.offDwell, dwells.bHiDwell, dwells.bLoDwell)
    const bLo= getPulse(tick, dwells.offDwell, dwells.bHiDwell, dwells.bLoDwell, true)
    const cHi= getPulse(tick, dwells.offDwell, dwells.cHiDwell, dwells.cLoDwell)
    const cLo= getPulse(tick, dwells.offDwell, dwells.cHiDwell, dwells.cLoDwell, true)

    console.log({dwells, aHi, aLo, bHi, bLo, cHi, cLo})
    await FS.promises.writeFile('data/aHi.pwm', aHi.getPulse(), 'utf8')
    await FS.promises.writeFile('data/aLo.pwm', aLo.getPulse(), 'utf8')
    await FS.promises.writeFile('data/bHi.pwm', bHi.getPulse(), 'utf8')
    await FS.promises.writeFile('data/bLo.pwm', bLo.getPulse(), 'utf8')
    await FS.promises.writeFile('data/cHi.pwm', cHi.getPulse(), 'utf8')
    await FS.promises.writeFile('data/cLo.pwm', cLo.getPulse(), 'utf8')
}



