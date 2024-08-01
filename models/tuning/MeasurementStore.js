import fs, { write } from 'fs'
import yaml from 'js-yaml'
import Measurement from './Measurement.js'
import * as Config from '../../config/config.js'

export default class MeasurementStore{

    static DATA_DIR = '/Users/sanielfishawy/dev/motorController/motorControlServer/data/tuning/' 

    static getDefaultDataFile(){
        return MeasurementStore.DATA_DIR + Config.getDynamicTuningDataFile()
    }

    /**
     * @param {[Measurement]} measurements 
     */
    static saveMeasurements(measurements, file){
        const store = new this(file)

        const measurementsHash = {}
        for (let m of measurements){
            measurementsHash[m.id] = m.paramsForStore
        }

        store.write(measurementsHash)
    }

    constructor(file){
        this.file = MeasurementStore.DATA_DIR + (file || Config.getDynamicTuningDataFile())
    }

    /**
     * @param {Measurement} measurement 
     */
    saveMeasurement(measurement){
        const measurements = this.read()
        measurements[measurement.id] = measurement.paramsForStore
        this.write(measurements)
    }

    /**
     * @returns {Object}
     */
    getMeasurements(){
        return this.read()
    }

    /**
     * @returns {[Measurement]}
     */
    getMeasurementsAsArray(){
        const measurements = this.getMeasurements()
        return Object.keys(measurements).map(k => new Measurement(measurements[k]))
    }

    read(){
        if (!fs.existsSync(this.file)) return {}
        const yml = fs.readFileSync(this.file, 'utf8')
        return yaml.load(yml)
    }

    write(measurements){
        const yml = yaml.dump(measurements)
        fs.writeFileSync(this.file, yml)
    }

    hasMeasurement(params){
        const measurements = this.getMeasurements()
        return measurements[JSON.stringify(params)] !== undefined   
    }

}
