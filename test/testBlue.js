import * as chai from 'chai'
import Measurements from '../models/tuning/Measurements.js'
import MeasurementStore from '../models/tuning/MeasurementStore.js'

const expect = chai.expect

describe('blue.yml', () => {
    let r, measurements

    before( () => {
        const ms = new MeasurementStore('blue.yml').getMeasurementsAsArray()
        measurements = new Measurements(ms)
    })

    describe('slipGroups', () => {
        it('should return slip groups that all have measurements', () => {
            r = measurements.slipGroups
            for (const sg of r) {
                expect(sg.measurements.length).to.be.greaterThan(0)
            }
        })
    })
})