import * as chai from 'chai'
import * as Pwm from '../script/spicePwm.js'

const expect = chai.expect

describe('testSpicePwm', () => {

    let r

    describe('getValue()',  () => {
        it('Should return 1 for a quarter cycle', () => {
            r = Pwm.getValue(25)
            expect(r).to.equal(1)

            r = Pwm.getValue(125)
            expect(r).to.equal(1)
        
            r = Pwm.getValue(0, Math.PI / 2)
            expect(r).to.equal(1)

            r = Pwm.getValue(50, Math.PI /2)
            expect(r).to.equal(-1)
        })
    })

    describe('getPulse', () => {
        it('Should return a 50% duty cycle for 45 degrees', () => {
            r = Pwm.getPulse(0)
            expect(r.side).to.equal('lo')
            expect(r.pwm).contains('0.1us')
            
            r = Pwm.getPulse(25)
            expect(r.side).to.equal('hi')
            expect(r.pwm).contains('2500us')
        })
    })

    describe('getPulses', () => {
        it('Should return the pulses for a side', () => {
            r = Pwm.getPulses('hi')
            console.log(r)
        })
    })
})