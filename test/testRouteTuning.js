import * as Config from '../config/config.js'
import * as chai from 'chai'
import * as Seed from '../models/tuning/MeasurementsSeed.js'

const expect = chai.expect

describe('testRouteTuning.js', () => {

    let r, j

    before(() => {
        Seed.MeasurementSeed.seedMeasurements()
    })

    describe('GET /tuning/slipGroups', () => {
        it('should return slipGroups', async () => {
            r = await fetch(Config.getTestPath('/tuning/slipGroups'))
            j = await r.json()
            expect(j.results[0]).to.have.property('minFreqHz')
            expect(j.results[0]).to.have.property('maxFreqHz')
            expect(j.results[0]).to.have.property('amplitudeFract')
            expect(j.results[0]).to.have.property('slipForMaxTorque')
            expect(j.results[0]).to.have.property('slipForNinetyPercentTorque')
            expect(j.results[0]).to.have.property('maxTorque')
            expect(j.results[0]).to.have.property('ninetyPercentTorque')
            expect(j.results.length).to.be.greaterThan(100)
        })

    })
})