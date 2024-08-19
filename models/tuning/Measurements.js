import Measurement from './Measurement.js'
import SlipGroup from './SlipGroup.js'
import TorqueNormalizer from './TorqueNormalizer.js'

export default class Measurements{

    /**
     * @param {[Measurement]} measurements 
     */
    constructor(measurements){
        this.measurements = measurements
    }

    get minFreqs(){
        const r = new Set()
        for (let m of this.measurements){
            r.add(m.params.minFreqHz)
        }
        return Array.from(r)
    }

    get amps(){
        const r = new Set()
        for (let m of this.measurements){
            r.add(m.params.amplitudeFract)
        }
        return Array.from(r)
    }

    withMinFreq(minFreq){
        return this.measurements.filter(m => this.fixedEqual(m.minFreqHz, minFreq))
    }

    withMinFreqAndAmp(minFreq, amp){
        return this.withMinFreq(minFreq).filter(m => this.fixedEqual(m.amplitudeFract, amp))
    }

    withMinFreqAmpAndSlip(minFreq, amp, slip){
        return this.withMinFreqAndAmp(minFreq, amp).filter(m => this.fixedEqual(m.slipFract, slip))
    }

    ampsForMinFreq(minFreq){
        const r = new Set()
        const measurements = this.withMinFreq(minFreq)
        for (let m of measurements){
            r.add(m.params.amplitudeFract)
        }
        return Array.from(r)
    }

    get slipGroups(){
        const slipGroups = []

        for (let minFreq of this.minFreqs){
            const amps = this.ampsForMinFreq(minFreq)
            for (let amp of amps){
                const measurements = this.withMinFreqAndAmp(minFreq, amp)
                slipGroups.push(new SlipGroup(measurements))
            }
        }
        return slipGroups
    }

    get paramsForUi(){
        const rawParams = this.slipGroups.map(sg => sg.paramsForUi)
        const tn = new TorqueNormalizer(rawParams, 1)
        return tn.normalizedParamsForUi
    }

    fixedEqual(a, b){
        return a.toFixed(3) === b.toFixed(3)
    }
}
