import * as chai from 'chai'
import * as Config from '../config/config.js'

const expect = chai.expect

describe('testRouteMotor.js', () => {

    let r, j

    before(() => {
    })

    describe.only('GET /motor/status', () => {
        it('should return motor status', async () => {
            for (let i = 0; i < 500; i++) {
                r = await fetch(Config.getTestPath('/motor/status'))
                j = await r.json()
                expect(j.ok).to.be.true
                console.log(i)
            }
        })

    })
})