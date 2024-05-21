import FS from 'fs'

const rt3 = Math.sqrt(3)

export class SvPwm{


    constructor(theta, amp=1, pwmPeriod=100){
        this.theta = theta
        this.amp = amp
        this.per = pwmPeriod
    }

    get alpha(){
        if(!this._alpha){
            this._alpha = this.amp * rt3 * Math.cos(this.theta) / 2.0
        }
        return this._alpha
    }

    get beta(){
        if(!this._beta){
            this._beta = this.amp * rt3 * Math.sin(this.theta) / 2.0
        }
        return this._beta
    }

    get t4(){
        if(!this._t4){
            this._t4 = this.alpha - this.beta / rt3
            this._t4 = Math.round(this._t4 * this.per)
        }
        return this._t4
    }

    get t6(){
        if(!this._t6){
            this._t6 = 2 * this.beta / rt3
            this._t6 = Math.round(this._t6 * this.per)
        }
        return this._t6
    }

    get t0(){
        return (this.per - this.t4 - this.t6) / 2
    }

    aPulse(startTs){
        const edgeTs = startTs + this.t0/2
        const pw = this.t4 + this.t6 + this.t0
        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    bPulse(startTs){
        const edgeTs = startTs + ( ( this.t0 + this.t4 ) / 2 )
        const pw = this.t6 + this.t0
        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    cPulse(startTs){
        const edgeTs = startTs + ( ( this.t0 + this.t4 + this.t6 ) / 2 )
        const pw = this.t0
        return new Pulse(startTs, edgeTs, pw, this.per)
    }

    
    get show(){
        const {theta, amp, alpha, beta, t4, t6, t0} = this
        return {theta, amp, alpha, beta, t4, t6, t0}
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
        if (this.edgeTs === this.startTs){
            this.edgeTs = this.startTs + 1
            this.pw = this.pw - 2
        }
        if (this.pw <= 0){
            this.pw = 1
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

export async function getPulses(theta, startTs){
    const pwm = new SvPwm(theta)
    console.log(pwm.show)
    const aPulse = pwm.aPulse(startTs)
    console.log(aPulse.show)
    const bPulse = pwm.bPulse(startTs)
    console.log(bPulse.show)
    const cPulse = pwm.cPulse(startTs)
    console.log(cPulse.show)

    await FS.promises.writeFile('data/aHi.pwm', aPulse.pulseHi, 'utf8')
    await FS.promises.writeFile('data/aLo.pwm', aPulse.pulseLo, 'utf8')
    await FS.promises.writeFile('data/bHi.pwm', bPulse.pulseHi, 'utf8')
    await FS.promises.writeFile('data/bLo.pwm', bPulse.pulseLo, 'utf8')
    await FS.promises.writeFile('data/cHi.pwm', cPulse.pulseHi, 'utf8')
    await FS.promises.writeFile('data/cLo.pwm', cPulse.pulseLo, 'utf8')
}