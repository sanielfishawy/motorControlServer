import * as chai from 'chai'
import MDNS from '../api/mdns.js'

const expect = chai.expect

describe('testMdns', () => {

    let r

    describe('getMotorIp', () => {

        it('Should return the ip of the motor.local mdns zone', async () => {
            r = await MDNS.getMotorIp()
            expect(r).to.be.a('string')
            expect(r).to.match(/(\d{1,3}\.){3}\d{1,3}/)
        })

    })

})


