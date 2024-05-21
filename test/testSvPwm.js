import * as chai from 'chai'
import * as Pwm from '../script/spiceSvPwm.js'

const expect = chai.expect

describe('testSpiceSvPwm', () => {

    let r

    describe('getSectorAndThetaForRad', () => {

        it('Should return the sector and theta for 0 rad', () => {
            r = Pwm.getSectorAndThetaForRad(0)
            expect(r.sector).to.equal(1)
            expect(r.theta).to.equal(0)

            r = Pwm.getSectorAndThetaForRad(Math.PI / 3)
            expect(r.sector).to.equal(2)
            expect(r.theta).to.equal(0)

            r = Pwm.getSectorAndThetaForRad(2 * Math.PI / 3 + Math.PI / 10)
            expect(r.sector).to.equal(3)
            expect(r.theta).to.equal(Math.PI / 10)

            r = Pwm.getSectorAndThetaForRad(10 * Math.PI - (Math.PI / 3))
            expect(r.sector).to.equal(6)
            expect(r.theta).to.approximately(0, 0.0001)
        })

    })

    describe('getPulses', () => {
        it('Should return pulses for tick and angleRad', async () => {
            await Pwm.getPulses(1, Math.PI / 6)
        })
    })
    
    describe('fract0Deg() fract60Deg',  () => {

        it('Should return the fraction of the zero degree vector and the 60 degree vector', () => { 

            for (let i = 0; i < 100; i++) {
                const rad = ( i / 100 )  * Math.PI / 3
                const fract0Deg = Pwm.fract0Deg(rad)
                const fract60Deg = Pwm.fract60Deg(rad)
                console.log({i, fract0Deg, fract60Deg, sum: fract0Deg + fract60Deg})
            }

        })

    })
})