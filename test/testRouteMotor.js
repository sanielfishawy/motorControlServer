import * as chai from 'chai'
import * as Config from '../config/config.js'

const expect = chai.expect

describe('testRouteMotor.js', () => {

    let r, j

    before(() => {
    })

    describe.only('GET /motor/status', () => {
        it('should return motor status', async () => {
            r = await fetch(Config.getTestPath('/motor/status'))
            j = await r.json()
            expect (j.ok).to.be.true
            expect(j.results).to.have.property('actTorque')
            console.log(j)
        })

    })
})