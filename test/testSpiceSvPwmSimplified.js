import * as chai from 'chai'
import * as PWM from '../script/spiceSvPwmSimplified.js'

const expect = chai.expect

describe.skip('testSpiceSvPwmSimplified', () => {

    describe('getDutyAndPhase()', () => {
        it('Should return the duty and phase for theta and amp', () => {
            const r = PWM.getDutyAndPhase(0)
            console.log(r)
        })

    })
})