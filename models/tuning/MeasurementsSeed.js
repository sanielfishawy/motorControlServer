import Measurement from './Measurement.js'

export class MeasurementSeed {
    static MAXIMUM_TORQUE = 10
    static MIN_SLIP_FRACT = 0.04
    static MAX_SLIP_FRACT = 0.4
    static SLIP_STEP = 0.02

    constructor({minFreqHz, maxFreqHz, freqStep, minAmplitudeFract, maxAmplitudeFract, ampStep}){
        this.minFreqHz = minFreqHz
        this.maxFreqHz = maxFreqHz
        this.freqStep = freqStep
        this.minAmplitudeFract = minAmplitudeFract
        this.maxAmplitudeFract = maxAmplitudeFract
        this.ampStep = ampStep
    }

    static seedMeasurements(){
        const minAmplitudeFract = 0.3
        const maxAmplitudeFract = 1
        const ampStep = 0.1
        const minFreqHz = 2
        const maxFreqHz = 60
        const freqStep = 2

        const ms =  new MeasurementSeed({
            minAmplitudeFract,
            maxAmplitudeFract,
            ampStep,
            minFreqHz,
            maxFreqHz,
            freqStep,
        }).measurements

        
    }

    get measurements(){
        let measurements = []
        for (let minFreqHz of this.freqs){
            for (let amplitudeFract of this.amps){
                const maxFreqHz = minFreqHz + this.freqStep
                const ms = new SlipSweep({
                    minSlipFract: this.constructor.MIN_SLIP_FRACT,
                    maxSlipFract: this.constructor.MAX_SLIP_FRACT,
                    slipStep: this.constructor.SLIP_STEP,
                    minFreqHz,
                    maxFreqHz,
                    amplitudeFract,
                    maxTorque: this.maxTorque(minFreqHz, amplitudeFract)
                }).measurements

                measurements = [...measurements, ...ms]
            }
        }
        return measurements
    }

    get freqs(){
        const r = []
        for(let freq=this.minFreqHz; freq<=this.maxFreqHz; freq+=this.freqStep){
            r.push(freq)
        }
        return r
    }

    get amps(){
        const r = []
        for(let amp=this.minAmplitudeFract; amp<=this.maxAmplitudeFract; amp+=this.ampStep){
            r.push(amp)
        }
        return r
    }

    maxTorque(freq, amp){
        return this.constructor.MAXIMUM_TORQUE * (0.1/1.1) * this.ampProportion(amp) / this.freqProportion(freq)
    }

    freqProportion(freq){
        return 0.1 + (freq - this.minFreqHz) / (this.maxFreqHz - this.minFreqHz)
    }

    ampProportion(amp){
        return 0.1 + (amp - this.minAmplitudeFract) / (this.maxAmplitudeFract - this.minAmplitudeFract)
    }

}

export class SlipSweep {

    constructor({minSlipFract, maxSlipFract, slipStep, minFreqHz, maxFreqHz, amplitudeFract, maxTorque}){
        this.minSlipFract = minSlipFract,
        this.maxSlipFract = maxSlipFract,
        this.slipStep = slipStep,
        this.minFreqHz = minFreqHz,
        this.maxFreqHz = maxFreqHz,
        this.amplitudeFract = amplitudeFract
        this.maxTorque = maxTorque
    }

    get measurements(){
        const vX = this.minSlipFract + (this.maxSlipFract - this.minSlipFract) * .75
        const vY = this.maxTorque
        const a = -50
        const p = new Parabola(vX, vY, a)

        const ms = []

        for (let slipFract = this.minSlipFract; slipFract <= this.maxSlipFract; slipFract += this.slipStep){
            const torque = p.getY(slipFract)
            const duration = 1 / torque
            const startTime = 1
            const endTime = startTime + duration

            const m = new Measurement({
                minFreqHz: this.minFreqHz,
                maxFreqHz: this.maxFreqHz,
                slipFract,
                amplitudeFract: this.amplitudeFract,
            })
            m.startTime = startTime
            m.endTime = endTime

            ms.push(m)
        }
        return ms
    }

}


export class Parabola{
    constructor(vX, vY, a){
        this.vX = vX
        this.vY = vY
        this.a = a
    }

    getY(x){
        return this.a * (x - this.vX)**2 + this.vY
    }
}