import * as chai from 'chai'
import UsbHandler from '../models/UsbHandler.js'
import getInput from '../util/getInput.js'

const expect = chai.expect

describe.skip('testModelUsbHandler.js', () => {
    let r

    before(async () => {
        UsbHandler.init()
    })

    describe('sendString()', () => {

        it('Should send the string and return ok', async () => {
            await getInput('Connect the USB cable and press enter to continue.\n')
            r = await UsbHandler.sendString(JSON.stringify({command: 'test'}))
            expect(r.ok).to.be.true
        })
    })
})