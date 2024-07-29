import Measurement from './Measurement.js'
import SlipGroup from './SlipGroup.js'

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

    withMinFreqAndAmp(minFreq, amp){
        return this.measurements.filter(m => m.params.minFreqHz === minFreq && m.params.amplitudeFract === amp)
    }

    get slipGroups(){
        const slipGroups = []
        
        for (let minFreq of this.minFreqs){
            for (let amp of this.amps){
                const measurements = this.withMinFreqAndAmp(minFreq, amp)
                slipGroups.push(new SlipGroup(measurements))
            }
        }
        return slipGroups
    }
}
