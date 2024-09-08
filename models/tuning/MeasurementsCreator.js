import Measurement from './Measurement.js'
import BlueZeroTorqueLimits from './BlueZeroTorqueLimits.js'

export default class MeasurementsCreator {

    static LOW_FREQ = 2
    static HIGH_FREQ = 30 
    static FREQ_STEP = 4

    static LOW_AMP = 0.2
    static HIGH_AMP = 1.0
    static AMP_STEP = 0.1

    static LOW_SLIP = 0.3
    static HIGH_SLIP = 0.7
    static SLIP_STEP = 0.1

    static getMeasurements() {
        const measurements = []
        for (let minFreqHz = this.LOW_FREQ; minFreqHz <= this.HIGH_FREQ; minFreqHz += this.FREQ_STEP) {
            for (let amplitudeFract = this.LOW_AMP; amplitudeFract <= this.HIGH_AMP; amplitudeFract += this.AMP_STEP) {

                if (BlueZeroTorqueLimits.hasZeroTorque(minFreqHz, amplitudeFract)) continue
                
                for (let slipFract = this.LOW_SLIP; slipFract <= this.HIGH_SLIP; slipFract += this.SLIP_STEP) {
                    const maxFreqHz = minFreqHz + this.FREQ_STEP
                    measurements.push(new Measurement({minFreqHz, maxFreqHz, slipFract, amplitudeFract}))
                }
            }
        }
        return measurements
    }
}
