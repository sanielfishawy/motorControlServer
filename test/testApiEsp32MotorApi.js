import * as chai from 'chai'
import _ from 'lodash'
import * as McApi from '../api/Esp32MotorApi.js'

const expect = chai.expect

describe.only('testApiEsp32MotorApi', () => {

    let r, j

    before(() => {
    })

    after(() => {
    })

    describe('GET commands', () => {

        describe('getFreqHz', () => {
            it('Should return the freqHz ', async () => {
                r = await McApi.getFreqHz()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.freqHz).to.be.a('number')
            })
        })

        describe('getAmplitudeFract', () => {
            it('Should return the AmplitudeFract', async () => {
                r = await McApi.getAmplitudeFract()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.amplitudeFract).to.be.a('number')
            })
        })

        describe('getIsActive', () => {
            it('Should return the active/float status', async () => {
                r = await McApi.getIsActive()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.isActive).to.be.a('boolean')
            })
        })

    })

    describe('PUT commands', () => {
        describe('setAmplitudeFract', () => {
            it("Shoud set the amplitudeFract and return the set amplitude", async () => {
                r = await McApi.setAmplitudeFract(0.1)
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.amplitudeFract).to.be.approximately(0.1, 0.0001)
            })

            it("Should return 400 error if the value is not given or is not a number", async () => {
                r = await McApi.setAmplitudeFract()
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
                r = await McApi.setAmplitudeFract('foo')
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
            })
        })

        describe('setFreqHz', () => {
            it("Shoud set the freqHz and return the set freq", async () => {
                r = await McApi.setFreqHz(31.2)
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.freqHz).to.be.approximately(31.2, 0.0001)
            })

            it("Should return 400 error if the value is not given or is not a number", async () => {
                r = await McApi.setFreqHz()
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
                r = await McApi.setFreqHz('foo')
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
            })
        })

        describe('setActive', () => {
            it("Shoud set to active and return the isActive", async () => {
                r = await McApi.setActive()
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.isActive).to.be.true
            })
        })
        describe('setFloat', () => {
            it("Shoud set to float and return the isActive", async () => {
                r = await McApi.setFloat()
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.isActive).to.be.false
            })
        })
    })
})


