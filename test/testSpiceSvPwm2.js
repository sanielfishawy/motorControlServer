import * as chai from 'chai'
import { SvPwm, getPulses } from '../script/spiceSvPwm2.js'

const expect = chai.expect

describe.skip('testSpiceSvPwm2', () => {

    let r

    describe('show()', () => {

        it('Should show all values', () => {
            const per = 100
            const amp = 1

            r = new SvPwm(0, amp, per).show
            expect(r.t4).to.approximately(per * Math.sqrt(3)/2, 0.5)
            expect(r.t6).to.equal(0)

            r = new SvPwm(Math.PI/3, amp, per).show
            expect(r.t4).to.approximately(0, .0001)
            expect(r.t6).to.approximately(per * Math.sqrt(3)/2, 0.5)

            r = new SvPwm(Math.PI/6, amp, per).show
            expect(r.t4).to.approximately(50, 0.5)
            expect(r.t6).to.approximately(50, 0.5)
        })
    })

    describe('getPulses()', () => {
        it('Should write pulses to files', async () => {
            await getPulses(11*Math.PI/6, 100)
        })
    })
})