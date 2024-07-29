import fs from 'fs'
import * as chai from 'chai'
import MeasurementStore from '../models/tuning/MeasurementStore.js'
import Measurement from '../models/tuning/Measurement.js'

const expect = chai.expect

describe('MeasurementStore.js', () => {
    const testFile = 'testMeasurementStore.yml'
    
    beforeEach(() => {
        removeFile(testFile)
    })

    after(() => {
        removeFile(testFile)
    })


    describe('Measurement', () => {
        describe('save()', () => {
            it('Should save the measurement', async () => {
                const m = new Measurement({minFreqHz: 1, maxFreqHz:2, slipFract:.1, amplitudeFract:.2})
                await m.save(testFile)

                const ms = new MeasurementStore(testFile)
                const measurements = await ms.getMeasurements()
                expect(measurements).to.deep.equal({[m.id]: m.paramsForStore})
            })
        })
    })

    describe('MeasurementStore', () => {

        describe('getMeasurements', () => {

            it('Should return an empty object if measurement file does not exist', async () => {
                const ms = new MeasurementStore('fileNotExists.yml')
                expect(await ms.getMeasurements()).to.deep.equal({})
            })

        })

        describe('saveMeasurement, getMeasurements', () => {

            it('Should save a measurement, and retrieve measurements', async () => {
                const ms = new MeasurementStore(testFile)
                const m = new Measurement({minFreqHz: 1, maxFreqHz: 2, slipFract: 3, amplitudeFract: 4})
                await ms.saveMeasurement(m)
                expect(await ms.getMeasurements()).to.deep.equal({[m.id]: m.paramsForStore})

                const m2 = new Measurement({minFreqHz: 5, maxFreqHz: 6, slipFract: 7, amplitudeFract: 8})
                await ms.saveMeasurement(m2)
                expect(await ms.getMeasurements()).to.deep.equal({[m.id]: m.paramsForStore, [m2.id]: m2.paramsForStore})
            })

        })

    })
})

function removeFile(testFile){
    const file = new MeasurementStore(testFile).file
    if (fs.existsSync(file)) fs.unlinkSync(file)
}