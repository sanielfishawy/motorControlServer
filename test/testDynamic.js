import fs from 'fs'
import * as chai from 'chai'
import * as Dyn from '../models/DynamicTuning.js'

const expect = chai.expect

describe.only('DynamicTuning', () => {
    const testFile = 'testDynamic.yml'
    
    beforeEach(() => {
        removeFile(testFile)
    })

    after(() => {
        removeFile(testFile)
    })


    describe('Measurement', () => {
        describe('save()', () => {
            it('Should save the measurement', async () => {
                const m = new Dyn.Measurement({minFreqHz: 1, maxFreqHz:2, slipFract:.1, amplitudeFract:.2})
                await m.save(testFile)

                const ms = new Dyn.MeasurementStore(testFile)
                const measurements = await ms.getMeasurements()
                expect(measurements).to.deep.equal({[m.id]: m.paramsForStore})
            })
        })
    })

    describe('MeasurementStore', () => {

        describe('getMeasurements', () => {

            it('Should return an empty object if measurement file does not exist', async () => {
                const ms = new Dyn.MeasurementStore('fileNotExists.yml')
                expect(await ms.getMeasurements()).to.deep.equal({})
            })

        })

        describe('saveMeasurement, getMeasurements', () => {

            it('Should save a measurement, and retrieve measurements', async () => {
                const ms = new Dyn.MeasurementStore(testFile)
                const m = new Dyn.Measurement({minFreqHz: 1, maxFreqHz: 2, slipFract: 3, amplitudeFract: 4})
                await ms.saveMeasurement(m)
                expect(await ms.getMeasurements()).to.deep.equal({[m.id]: m.paramsForStore})

                const m2 = new Dyn.Measurement({minFreqHz: 5, maxFreqHz: 6, slipFract: 7, amplitudeFract: 8})
                await ms.saveMeasurement(m2)
                expect(await ms.getMeasurements()).to.deep.equal({[m.id]: m.paramsForStore, [m2.id]: m2.paramsForStore})
            })

        })

    })
})

function removeFile(testFile){
    const file = new Dyn.MeasurementStore(testFile).file
    if (fs.existsSync(file)) fs.unlinkSync(file)
}