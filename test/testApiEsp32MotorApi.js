import * as chai from 'chai'
import _ from 'lodash'
import * as McApi from '../api/esp32MotorApi.js'

const expect = chai.expect

describe('testApiEsp32MotorApi', () => {

    let r, j

    before(() => {
    })

    after(() => {
    })
    
    describe('POST commands', () => {
        describe('setDynamicMeasurement', () => {
            it('Should set the dynamic measurement if all parameters are correct', async () => {
                const measurement = {
                    minFreqHz: 10.5,
                    maxFreqHz: 15.5,
                    slipFract: 0.1,
                    amplitudeFract: 0.5,
                }
                r = await McApi.setDynamicMeasurement(measurement)
                expect(r.ok).to.be.true
                j = await r.json()
                expect(j.results.minFreqHz).to.be.approximately(10.5, 0.0001)
                expect(j.results.maxFreqHz).to.be.approximately(15.5, 0.0001)
                expect(j.results.slipFract).to.be.approximately(0.1, 0.0001)    
                expect(j.results.amplitudeFract).to.be.approximately(0.5, 0.0001)
            })

            it('Should return 400 error if a parameter is not correct', async () => {
                const measurement = {
                    minFreqHz: 10.5,
                    maxFreqHz: 15.5,
                    slipFract: 0.1,
                    amplitudeFract: 'foo',
                }
                r = await McApi.setDynamicMeasurement(measurement)
                expect(r.ok).to.be.false
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.error).to.be.a('string')
            })
        })
    })
    
    describe('GET commands', () => {

        describe('getStatus', () => {
            it('Should return the status', async () => {
                r = await McApi.getStatus()
                j = await r.json()
                console.log(j)
            })
        })

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

        describe('getDynamicMeasurement', () => {
            it('Should return the dynamic measurement', async () => {
                r = await McApi.getDynamicMeasurement()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.minFreqHz).to.be.a('number')
                expect(j.results.maxFreqHz).to.be.a('number')
                expect(j.results.slipFract).to.be.a('number')
                expect(j.results.amplitudeFract).to.be.a('number')
                expect(j.results.startTime).to.be.a('number')
                expect(j.results.endTime).to.be.a('number')
            })
        })

        describe('getUseGoPedal', () => {
            it('Should return the useGoPedal state', async () => {
                r = await McApi.getUseGoPedal()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.useGoPedal).to.be.a('boolean')
            })
        })

        describe('getTorque', () => {
            it('Should return the torque', async () => {
                r = await McApi.getTorque()
                j = await r.json()
                expect(r.ok).to.be.true
                expect(j.results.torqueFract).to.be.a('number')
            })
        })

        describe('getGoPedalStatus', () => {
            it('Should return the goPedalStatus', async () => {
                r = await McApi.getGoPedalStatus()
                j = await r.json()
                expect(j.ok).to.be.a('boolean')
                if(!j.ok){
                    expect (j.error).to.be.a('object')
                }
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

        describe('setTorque', () => {
            it("Shoud set the torque and return the set torque", async () => {
                r = await McApi.setTorque(0.1)
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.torqueFract).to.be.approximately(0.1, 0.0001)
            })

            it("Should return 400 error if the value is not given or is not a number", async () => {
                r = await McApi.setTorque()
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
                r = await McApi.setTorque('foo')
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
            })
        })

        describe('setUseGoPedal', () => {
            it("Shoud set the useGoPedal and return the set useGoPedal", async () => {
                r = await McApi.setUseGoPedal(true)
                expect(r.status).to.equal(200)
                j = await r.json()
                expect(j.ok).to.be.true
                expect(j.results.useGoPedal).to.be.true
            })

            it("Should return 400 error if the value is not given or is not a number", async () => {
                r = await McApi.setUseGoPedal()
                expect(r.status).to.equal(400)
                j = await r.json()
                expect(j.ok).to.be.false
                expect(j.error).to.be.a('string')
                r = await McApi.setUseGoPedal('foo')
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


