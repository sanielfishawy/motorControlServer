import fs, { write } from 'fs'
import yaml from 'js-yaml'
import { assert } from 'chai'
import * as MAPI from '../api/esp32MotorApi.js'
import { sleep } from '../util/sleep.js'

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

export class Measurement {

    constructor({minFreqHz, maxFreqHz, slipFract, amplitudeFract}) {
        this._params = {minFreqHz, maxFreqHz, slipFract, amplitudeFract}
        this.startTime = 0
        this.endTime = 0
    }

    async run() {
        const result = await MeasurementRunner.run(this)
        this.startTime = result.startTime
        this.endTime = result.endTime
        return this.duration
    }

    get params() {
        return this._params
    }

    get paramsForStore() {
        return {...this.params, startTime: this.startTime, endTime: this.endTime}
    }

    get id() {
        return JSON.stringify(this.params)
    }

    get duration() {
        if (this.endTime == 0) return null 
        return this.endTime - this.startTime
    }

    get slipFract(){
        return this.params.slipFract
    }

    async save(file='dynamicTuning.yml'){
        const ms = new MeasurementStore(file)
        return ms.saveMeasurement(this)
    }
}

export class Measurements {

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

export class MeasurementStore{

    static DATA_DIR = '/Users/sanielfishawy/dev/motorController/motorControlServer/data/tuning/' 

    constructor(file='dynamicTuning.yml'){
        this.file = MeasurementStore.DATA_DIR + file
    }


    /**
     * @param {Measurement} measurement 
     */
    async saveMeasurement(measurement){
        const measurements = await this.read()
        measurements[measurement.id] = measurement.paramsForStore
        await this.write(measurements)
    }

    async getMeasurements(){
        return this.read()
    }

    async read(){
        if (!fs.existsSync(this.file)) return {}
        const yml = await fs.promises.readFile(this.file, 'utf8')
        return yaml.load(yml)
    }

    async write(measurements){
        const yml = yaml.dump(measurements)
        await fs.promises.writeFile(this.file, yml)
    }

}

async function runMeasurements() {
    const measurements = Measurements.getMeasurements()
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
