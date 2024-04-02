import * as chai from 'chai'
import { sleep } from '../util/sleep.js'
import { RemoteControlCommand } from '../models/RemoteControl.js'
import RemoteControl from '../models/RemoteControl.js'

const expect = chai.expect

describe.only('testModelRemoteControl', () => {

    let r

    before(async () => {
        RemoteControl.init()
        await sleep(4000)
    })

    describe('RemoteControlCommand', () => {

        describe('testResolveReject', () => {
            it('Should return a promise that can be reoslved or rejected', async () => {
                const command = new RemoteControlCommand({command: 'foo'})
                command.resolve({ok: true, results: 'foobar'})
                r = await command.testResolveReject()
                expect(r.ok).to.be.true
                expect(r.results).to.equal('foobar')
            })
        })

    })

    describe.only('RemoteControl', () => {
        describe('transmit()', async () => {
            
            it('Should transmit the command and return the response', async () => {
                r = await RemoteControl.transmit({command: 'foo'})
                console.log({r})
            })

        })
    })

})