import * as chai from 'chai'
import {MeasurementRunner} from '../models/tuning/MeasurementsRunner.js'
import Measurement from '../models/tuning/Measurement.js'

const expect = chai.expect

describe('MeasurementsRunner.js', () => {

    describe('MeasurementRunner', () => {

        it('should create measurements', async () => {
            const m = new Measurement({minFreqHz: 2, maxFreqHz: 4, slipFract: 0.25, amplitudeFract: 0.6})
            await MeasurementRunner.run(m)
        })
    })

})