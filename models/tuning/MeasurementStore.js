import fs, { write } from 'fs'
import yaml from 'js-yaml'
import Measurement from './Measurement.js'
import Measurements from './Measurements.js'
import * as Config from '../../config/config.js'
import Logger from '../../util/Logger.js'

const log = new Logger({prefix: 'MeasurementStore'})

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

    getMeasurementsAsInstanceOfMeasurements(){
        return new Measurements(this.getMeasurementsAsArray())
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

    /**
     * @param {Measurement} measurement 
     * @returns {boolean}
     */
    hasMeasurement(measurement){
        const measurements = this.getMeasurements()
        return measurements[measurement.id] !== undefined   
    }

    removeMeasurement(measurement){
        const measurements = this.getMeasurements()
        log.info('Removing measurement', measurements[measurement.id])
        delete measurements[measurement.id]
        this.write(measurements)
    }

}
