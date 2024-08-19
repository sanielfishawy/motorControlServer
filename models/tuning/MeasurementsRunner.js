import * as MAPI from '../../api/esp32MotorApi.js'
import { sleep } from '../../util/sleep.js'
import Logger from '../../util/Logger.js'
import Measurement from './Measurement.js'
import MeasurementsCreator from './MeasurementsCreator.js'
import MeasurementStore from './MeasurementStore.js'


export class MeasurementRunner {
    static log = new Logger({prefix: this.name})

    /**
     * @param {Measurement} measurement 
     */
    static async run(measurement) {
        this.log.info(`Running measurement ${measurement.id}`)
        await this.setupMeasurement(measurement)
        const result = await this.getResult()
        return result
    }

    /**
     * @param {Measurement} measurement 
     */
    static async setupMeasurement(measurement) {
        const r = await MAPI.setDynamicMeasurement(measurement.params)
        const j = await r.json()
    }

    static async getResult() {
        let endTime = 0
        let j
        while (endTime == 0) {
            const r = await MAPI.getDynamicMeasurement()
            j = await r.json()
            endTime = j.results.endTime
            await sleep(500)
        }
        return j.results
    }
}

export class MeasurementsRunner {

    static log = new Logger({prefix: this.name})
    static FILENAME = 'blue.yml'

    static async run() {
        const measurements = MeasurementsCreator.getMeasurements()
        const mStore = new MeasurementStore(this.FILENAME)

        for (const measurement of measurements) {
            if (mStore.hasMeasurement(measurement)){
                console.log('Measurement already exists', measurement.id)
                continue
            }
            await measurement.run()
            mStore.saveMeasurement(measurement)
            this.log.info(`Saved measurement`, measurement)
        }
    }

}

// await MeasurementsRunner.run()

// const measurement = new Measurement({minFreqHz:14, maxFreqHz:18, slipFract:0.07, amplitudeFract:0.2})
// console.log(await measurement.run())
// console.log(measurement)
