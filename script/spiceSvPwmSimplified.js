// This algorithm is taken from this excellent paper: file:///Users/sanielfishawy/Downloads/energies-15-04065.pdf

export class SvPwm{

    static TS = 100
    static MAGNITUDE_VA = 2

    constructor(thetaRad, amp=1){
        this.amp = amp
        this.thetaRad = thetaRad
        this.r = Math.sqrt(3) * this.amp
    }

    getRAlpha(){
        if (!this.alpha){
            this.alpha = this.r * Math.cos(this.thetaRad)
        }
        return this.alpha
    }

    getRBeta(){
        if (!this.beta){
            this.beta = this.r * Math.sin(this.thetaRad)
        }
        return this.beta
    }

    getVAlpha(){
        if (!this.vAlpha){
            this.vAlpha = this.constructor.TS * this.getRAlpha() / this.constructor.MAGNITUDE_VA
        }
        return this.vAlpha  
    }

    getVBeta(){
        if (!this.vBeta){
            this.vBeta = this.constructor.TS * this.getRBeta() / this.constructor.MAGNITUDE_VA
        }
        return this.vBeta
    }

    getA(){
        if(!this.a){
            this.a = this.getVAlpha() + ( Math.sqrt(3) * this.getVBeta() / 3 )
        }
        return this.a
    }

    getB(){ 
        if(!this.b){
            this.b = 2 * this.getVBeta() * Math.sqrt(3) / 3 
        }
        return this.b
    }

    getC(){
        if(!this.c){
            this.c = this.getA() - this.getB()
        }
        return this.c
    }   

    getDutyA(){
        if(!this.dutyA){
            this.dutyA = 0.5 - ( (this.getA() + this.getB()) / 3.0 )
        }
        return this.dutyA
    }

    getDutyB(){
        if(!this.dutyB){
            this.dutyB = 0.5 + ( ( 2 * this.getA() - this.getB() ) / 3.0 )
        }
        return this.dutyB
    }

    getDutyC(){
        if(!this.dutyC){
            this.dutyC = 0.5 + ( ( 2 * this.getB() - this.getA() ) / 3.0 )
        }
        return this.dutyC
    }

    getPhaseB(){
        if(!this.phaseB){
            this.phaseB = ( this.getA() + this.getB() ) / 6.0
        }
        return this.phaseB
    }

    getPhaseC(){
        if(!this.phaseC){
            this.phaseC = ( 2* this.getB() - this.getA() ) / 6.0
        }
        return this.phaseC
    }
}

export function getDutyAndPhase(thetaRad, amp=1){
    const svPwm = new SvPwm(thetaRad, amp)
    const alpha = svPwm.getVAlpha()
    const beta = svPwm.getVBeta()
    const a = svPwm.getA()
    const b = svPwm.getB()
    const c = svPwm.getC()
    const dutyA = svPwm.getDutyA()
    const dutyB = svPwm.getDutyB()
    const dutyC = svPwm.getDutyC()
    const phaseB = svPwm.getPhaseB()
    const phaseC = svPwm.getPhaseC()
    return {alpha, beta, a, b, c, dutyA, dutyB, dutyC, phaseB, phaseC}
}