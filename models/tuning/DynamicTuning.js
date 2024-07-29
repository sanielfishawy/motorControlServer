import * as MAPI from '../../api/esp32MotorApi.js'
import { sleep } from '../../util/sleep.js'

import Measurement from './Measurement.js'

export class MeasurementRunner {

    /**
     * @param {Measurement} measurement 
     */
    static async run(measurement) {

        await this.setupMeasurement(measurement)
        const result = await this.getResult()
        return result
    }

    static async setupMeasurement(measurement) {
        const r = await MAPI.setDynamicMeasurement(measurement.params)
        const j = await r.json()
        assert(j.ok)
    }

    static async getResult() {
        let endTime = 0
        let j
        while (endTime == 0) {
            const r = await MAPI.getDynamicMeasurement()
            j = await r.json()
            assert(j.ok)
            endTime = j.results.endTime
            await sleep(500)
        }
        return j.results
    }
}

export class MeasurementsCreator {

    static LOW_FREQ = 10
    static HIGH_FREQ = 15 
    static FREQ_STEP = 5


    static LOW_AMP = 0.9
    static HIGH_AMP = .99
    static AMP_STEP = 0.1

    static LOW_SLIP = 0.06
    static HIGH_SLIP = 0.6
    static SLIP_STEP = 0.01

    static getMeasurements() {
        const measurements = []
        for (let minFreqHz = this.LOW_FREQ; minFreqHz < this.HIGH_FREQ; minFreqHz += this.FREQ_STEP) {
            for (let amplitudeFract = this.LOW_AMP; amplitudeFract < this.HIGH_AMP; amplitudeFract += this.AMP_STEP) {
                for (let slipFract = this.LOW_SLIP; slipFract <= this.HIGH_SLIP; slipFract += this.SLIP_STEP) {
                    const maxFreqHz = minFreqHz + this.FREQ_STEP
                    measurements.push(new Measurement({minFreqHz, maxFreqHz, slipFract, amplitudeFract}))
                }
            }
        }
        return measurements
    }
}

async function runMeasurements() {
    const measurements = MeasurementsCreator.getMeasurements()
    for (const measurement of measurements) {
        console.log(measurement.params)
        const result = await measurement.run()
        console.log(result, '\n')
    }

    for (const measurement of measurements) {
        console.log(measurement.slipFract)
    }

    for (const measurement of measurements) {
        console.log(measurement.duration)
    }
}

// await runMeasurements()

// const measurement = new Measurement({minFreqHz: 10, maxFreqHz: 12, slipFract: 0.2, amplitudeFract: 0.33})
// console.log(await measurement.run())

// const r = await MAPI.getDynamicMeasurement()
// const j = await r.json()
// console.log(j)
