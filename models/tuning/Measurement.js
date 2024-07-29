import MeasurementStore from './MeasurementStore.js'

export default class Measurement {

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

    get ampFreqId() {
        return JSON.stringify({
            minFreqHz: this.params.minFreqHz, 
            maxFreqHz: this.params.maxFreqHz,
            amplitudeFract: this.params.amplitudeFract, 
        })
    }

    get duration() {
        if (this.endTime <= 0) return null 
        return this.endTime - this.startTime
    }

    get torque(){
        if(!this.duration) return 0
        return 1/this.duration
    }

    get slipFract(){
        return this.params.slipFract
    }

    get minFreqHz(){
        return this.params.minFreqHz
    }

    get amplitudeFract(){
        return this.params.amplitudeFract
    }

    async save(file='dynamicTuning.yml'){
        const ms = new MeasurementStore(file)
        return ms.saveMeasurement(this)
    }
}