import * as chai from 'chai'
import Measurements from '../models/tuning/Measurements.js'
import * as Seed from '../models/tuning/MeasurementsSeed.js'
import MeasurementStore from '../models/tuning/MeasurementStore.js'

const expect = chai.expect

describe('Measurements', () => {
    let r, measurements

    before( () => {
        Seed.MeasurementSeed.seedMeasurements()
        const ms = new MeasurementStore().getMeasurementsAsArray()
        measurements = new Measurements(ms)
    })

    describe('paramsForUi', () => {
        it('should return an array of objects and torques should be normalized', () => {
            r = measurements.paramsForUi
            const torques = getTorques(r)
            expect(Math.max(...torques)).to.equal(1)
        })
    })
})

function getTorques(paramsForUi) {
    const torques = []
    paramsForUi.forEach( p => {
        for (const stp of p.slipTorquePoints) {
            torques.push(stp.torque)
        }
    })
    return torques
}