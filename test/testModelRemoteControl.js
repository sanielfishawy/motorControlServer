import * as chai from 'chai'
import _ from 'lodash'
import getInput from '../util/getInput.js'
import { RemoteControlCommand } from '../models/RemoteControl.js'
import RemoteControl from '../models/RemoteControl.js'

const expect = chai.expect

describe('testModelRemoteControl', () => {

    let r

    before(() => {
        RemoteControl.init()
    })

    after(() => {
        RemoteControl.deInit()
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

    describe('RemoteControl', () => {
        describe('transmit()', async () => {
           
            it('Should resolve with error if command is not provided. RC.commands should be empty', async () => {
                r = await RemoteControl.transmit()
                expect(r.ok).to.be.false
                expect(r.error).to.include('must be')
                expect(_.isEmpty(RemoteControl.commands)).to.be.true
            })
            
            it('Should resolve with error if UsbHandler.sendString() returns an error. RC.commands should be empty.', async () => {
                await getInput('Disconnect the USB cable and press enter to continue.\n')
                expect(RemoteControl.commands).to.be.empty
                r = await RemoteControl.transmit({foo:function(){}})
                expect(r.ok).to.be.false
                expect(r.error).to.include('No stm')
                expect(RemoteControl.commands).to.be.empty
            })

            it('Should transmit the command and return the response if all ok. ', async () => {
                await getInput('Connect the USB cable and press enter to continue.\n')
                expect(RemoteControl.commands).to.be.empty
                r = await RemoteControl.transmit({command: 'foo'})
                expect(r.ok).to.be.true
                expect(r.results.command).to.include('foo')
                expect(RemoteControl.commands).to.be.empty
            })

        })
    })

})