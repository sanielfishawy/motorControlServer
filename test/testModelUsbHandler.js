import * as chai from 'chai'
import { sleep } from '../util/sleep.js'
import UsbHandler from '../models/UsbHandler.js'

const expect = chai.expect

describe('testModelUsbHandler.js', () => {
    let r

    before(async () => {
        UsbHandler.init()
        await sleep(5000)
    })

    describe('sendString()', () => {
        it('Should send the string and return ok', async () => {
            r = await UsbHandler.sendString('this is a long test string \n')
            console.log({r})
        })
    })
})