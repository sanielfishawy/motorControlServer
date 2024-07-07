import FS from 'fs'

const rt3 = Math.sqrt(3)

export class SvPwm{


    constructor(theta, amp=1, pwmPeriod=100){
        this.theta = theta % (2 * Math.PI)
        this.sectorTheta = this.theta % (Math.PI/3)
        this.amp = amp
        this.per = pwmPeriod
    }

    get sector(){
        if(!this._sector){
            if      (this.theta <     Math.PI/3){
                this._sector = 1
            }else if(this.theta < 2 * Math.PI/3){
                this._sector = 2
            }else if(this.theta < 3 * Math.PI/3){
                this._sector = 3
            }else if(this.theta < 4 * Math.PI/3){
                this._sector = 4
            }else if(this.theta < 5 * Math.PI/3){
                this._sector = 5
            }else {
                this._sector = 6
            }
        }
        return this._sector
    }

    isSector(n){
        return this.sector === n
    }

    get alpha(){
        if(!this._alpha){
            this._alpha = this.amp * rt3 * Math.cos(this.sectorTheta) / 2.0
        }
        return this._alpha
    }

    get beta(){
        if(!this._beta){
            this._beta = this.amp * rt3 * Math.sin(this.sectorTheta) / 2.0
        }
        return this._beta
    }

    get zeroDegT(){
        if(!this._zeroDegT){
            this._zeroDegT = this.per * (this.alpha - (this.beta / rt3))
        }
        return this._zeroDegT
    }

    get sixtyDegT(){
        if(!this._sixtyDegT){
            this._sixtyDegT = this.per * 2 * this.beta / rt3
        }
        return this._sixtyDegT
    }

    get t4(){
        if(!this._t4){
            this._t4 = 0
            if(this.isSector(1)){
                this._t4 = this.zeroDegT
            } 
            if(this.isSector(6)){
                this._t4 = this.sixtyDegT
            } 
        }
        return this._t4
    }

    get t6(){
        if(!this._t6){
            this._t6 = 0
            if(this.isSector(2)){
                this._t6 = this.zeroDegT
            }
            if(this.isSector(1)){
                this._t6 = this.sixtyDegT
            }
        }
        return this._t6
    }

    get t2(){
        if(!this._t2){
            this._t2 = 0
            if(this.isSector(3)){
                this._t2 = this.zeroDegT
            }
            if(this.isSector(2)){
                this._t2 = this.sixtyDegT
            }
        }
        return this._t2
    }

    get t3(){
        if(!this._t3){
            this._t3 = 0
            if(this.isSector(4)){
                this._t3 = this.zeroDegT
            }
            if(this.isSector(3)){
                this._t3 = this.sixtyDegT
            }
        }
        return this._t3
    }

    get t1(){
        if(!this._t1){
            this._t1 = 0
            if(this.isSector(5)){
                this._t1 = this.zeroDegT
            }
            if(this.isSector(4)){
                this._t1 = this.sixtyDegT
            }
        }
        return this._t1
    }

    get t5(){
        if(!this._t5){
            this._t5 = 0
            if(this.isSector(6)){
                this._t5 = this.zeroDegT
            }
            if(this.isSector(5)){
                this._t5 = this.sixtyDegT
            }
        }
        return this._t5
    }

    get t0(){
        return (this.per - this.t1 - this.t2 - this.t3 - this.t4 - this.t5 - this.t6) / 2
    }

    aPulse(startTs){
        let edgeTs
        let pw

        if(this.isSector(1)){
            edgeTs = startTs + (this.t0)/2
            pw = this.t0 + this.t4 + this.t6
        }
        if(this.isSector(2)){
            edgeTs = startTs + (this.t0 + this.t2) / 2
            pw = this.t0 + this.t6
        }
        if(this.isSector(3)){
            edgeTs = startTs + (this.t0 + this.t2 + this.t3) / 2
            pw = this.t0
        }
        if(this.isSector(4)){
            edgeTs = startTs + (this.t0 + this.t1 + this.t3) / 2
            pw = this.t0
        }
        if(this.isSector(5)){
            edgeTs = startTs + (this.t0 + this.t1) / 2
            pw = this.t0 + this.t5
        }
        if(this.isSector(6)){
            edgeTs = startTs + (this.t0) / 2
            pw = this.t4 + this.t5 + this.t0
        }

        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    bPulse(startTs){
        let edgeTs 
        let pw 
        if(this.isSector(1)){
            edgeTs = startTs + (this.t0 + this.t4) / 2
            pw = this.t0 + this.t6
        }
        if(this.isSector(2)){
            edgeTs = startTs + (this.t0) / 2
            pw = this.t0 + this.t2 + this.t6
        }
        if(this.isSector(3)){
            edgeTs = startTs + (this.t0) / 2
            pw = this.t0 + this.t2 + this.t3
        }
        if(this.isSector(4)){
            edgeTs = startTs + (this.t0 + this.t1) / 2
            pw = this.t0 + this.t3
        }
        if(this.isSector(5)){
            edgeTs = startTs + (this.t0 + this.t1 + this.t5) / 2
            pw = this.t0
        }
        if(this.isSector(6)){
            edgeTs = startTs + (this.t0 + this.t4 + this.t5) / 2
            pw = this.t0
        }

        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    cPulse(startTs){
        let edgeTs
        let pw
        if(this.isSector(1)){
            edgeTs = startTs + (this.t0 + this.t4 + this.t6) / 2
            pw = this.t0
        }
        if(this.isSector(2)){
            edgeTs = startTs + (this.t0 + this.t2 + this.t6) / 2
            pw = this.t0
        }
        if(this.isSector(3)){
            edgeTs = startTs + (this.t0 + this.t2) / 2
            pw = this.t0 + this.t3
        }
        if(this.isSector(4)){
            edgeTs = startTs + (this.t0) / 2
            pw = this.t0 + this.t1 + this.t3
        }
        if(this.isSector(5)){
            edgeTs = startTs + (this.t0) / 2
            pw = this.t0 + this.t1 + this.t5
        }
        if(this.isSector(6)){
            edgeTs = startTs + (this.t0 + this.t4) / 2
            pw = this.t0 + this.t5
        }
        
        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    
    get show(){
        const {
            theta,
            sector,
            sectorTheta,
            amp,
            alpha,
            beta,
            t0,
            t1, 
            t2,
            t3,
            t4,
            t5,
            t6,
        } = this

        return {
            theta,
            sector,
            sectorTheta,
            amp,
            alpha,
            beta,
            t0,
            t1,
            t2,
            t3,
            t4,
            t5,
            t6,
        }
    }

    round(num, n=5){
        return Math.round(num * Math.pow(10, n)) / Math.pow(10, n)
    }

}

export class Pulse{
    
    constructor(startTs, edgeTs, pw, per){
        this.startTs = startTs
        this.edgeTs  = edgeTs
        this.pw  = pw
        if (this.edgeTs <= this.startTs){
            this.edgeTs = this.startTs + 1
            this.pw = this.pw - 2
        }
        if (this.pw <= 0.5){
            this.pw = 1
        }
        if (this.pw >= per - 0.5){
            this.pw = per - 1
        }
        this.per = per
    }

    get riseTime(){return 0.1}
    get fallTime(){return 0.1}
    get timeUnit(){return 'us'}
    get voltUnit(){return 'V'}
    get hiVolt(){return 15}
    get loVolt(){return 0}
    get hiV(){return `${this.hiVolt}${this.voltUnit}`}
    get loV(){return `${this.loVolt}${this.voltUnit}`}


    time(ts){
        return `${ts}${this.timeUnit} `
    }

    lo(ts){
        return this.time(ts) + this.loV + '\n'
    }

    hi(ts){
        return this.time(ts) + this.hiV + '\n'
    }

    rise(ts){
        return this.lo(ts) + this.hi(ts + this.riseTime) 
    }

    fall(ts){
        return this.hi(ts) + this.lo(ts + this.fallTime) 
    }

    get pulseHi(){
        return  this.lo(this.startTs) + 
                this.rise(this.edgeTs) + 
                this.fall(this.edgeTs + this.pw) +  
                this.lo(this.startTs + this.per - 0.1) +
                '\n'
    }
    
    get pulseLo(){
        return  this.hi(this.startTs) +
                this.fall(this.edgeTs) +
                this.rise(this.edgeTs + this.pw) +
                this.hi(this.startTs + this.per - 0.1) +
                '\n'
    }

    get show(){
        const {startTs, edgeTs, pw, per} = this
        return {startTs, edgeTs, pw, per}
    }
    
}

export async function getPulses(){
    const numCycles = 5
    const sinPeriod = 10000.0
    const pwmPeriod = 100.0
    const amp = 1.0

    let aHi = ''
    let aLo = ''
    let bHi = ''
    let bLo = ''
    let cHi = ''
    let cLo = ''

    for (let startTs=0; startTs<sinPeriod * numCycles; startTs+=pwmPeriod){
        const fract = startTs / sinPeriod
        const theta = 2 * Math.PI * fract
        const pwm = new SvPwm(theta, amp, pwmPeriod)
        const aPulse = pwm.aPulse(startTs)
        const bPulse = pwm.bPulse(startTs)
        const cPulse = pwm.cPulse(startTs)
        aHi += aPulse.pulseHi
        aLo += aPulse.pulseLo
        bHi += bPulse.pulseHi
        bLo += bPulse.pulseLo
        cHi += cPulse.pulseHi
        cLo += cPulse.pulseLo
    }

    await FS.promises.writeFile('data/aHi.pwm', aHi, 'utf8')
    await FS.promises.writeFile('data/aLo.pwm', aLo, 'utf8')
    await FS.promises.writeFile('data/bHi.pwm', bHi, 'utf8')
    await FS.promises.writeFile('data/bLo.pwm', bLo, 'utf8')
    await FS.promises.writeFile('data/cHi.pwm', cHi, 'utf8')
    await FS.promises.writeFile('data/cLo.pwm', cLo, 'utf8')
}

await getPulses()