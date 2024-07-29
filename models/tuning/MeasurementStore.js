import fs, { write } from 'fs'
import yaml from 'js-yaml'
import Measurement from './Measurement.js'

export default class MeasurementStore{

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
