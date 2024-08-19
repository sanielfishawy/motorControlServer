import * as chai from 'chai'
import MeasurementsCreator from '../models/tuning/MeasurementsCreator.js'
import Measurement from '../models/tuning/Measurement.js'

const expect = chai.expect

describe('MeasurementCreator', () => {
    let r
    
    it('should create measurements', () => {
        r = MeasurementsCreator.getMeasurements()
        expect(r.length).to.be.greaterThan(0)
        expect(r[0]).to.be.an.instanceof(Measurement)
    })
})