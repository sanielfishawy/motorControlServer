import * as chai from 'chai'
import * as Seed from '../models/tuning/MeasurementsSeed.js'
import Measurement from '../models/tuning/Measurement.js'
import Measurements from '../models/tuning/Measurements.js'

const expect = chai.expect

describe.only('MeasurementSeed.js', () => {

    describe('Parabola', () => {
        describe('getY()', () => {
            it('Should return the y value for a given x', () => {
                const p = new Seed.Parabola(4, 4, -1)
                expect(p.getY(4)).to.equal(4)
                expect(p.getY(5)).to.equal(3)
            })
        })
    })
    

    describe('SlipSweep', () => {

        describe ('measurements', () => {
            it('Should get seed measurements with parabola shaped durations', () => {
                const dts = new Seed.SlipSweep({
                    minSlipFract: 0.06,
                    maxSlipFract: 0.4,
                    slipStep: 0.01,
                    minFreqHz: 2,
                    maxFreqHz: 4, 
                    amplitudeFract: 0.5,
                    maxTorque: 5,
                })

                expect(dts.measurements.length).to.equal(34)
            })
        })
    })

    describe('MeasurementSeed', () => {
        describe('measurements()', () => {
            it('Should return an array of measurements', () => {
                const minAmplitudeFract = 0.3
                const maxAmplitudeFract = 1
                const ampStep = 0.1
                const minFreqHz = 2
                const maxFreqHz = 60
                const freqStep = 2

                const ms = new Seed.MeasurementSeed({
                    minAmplitudeFract,
                    maxAmplitudeFract,
                    ampStep,
                    minFreqHz,
                    maxFreqHz,
                    freqStep,
                })

                expect(ms.maxTorque(minFreqHz, maxAmplitudeFract)).to.approximately(10, 0.01)

                const measurements = new Measurements(ms.measurements)
                const slipGroups = measurements.slipGroups
                expect(slipGroups.length).to.equal(240)
                // for (let sg of slipGroups){
                //     console.log({
                //         minFreqHz: sg.minFreq,
                //         amplitudeFract: sg.amplitudeFract,
                //         maxTorque: sg.maxTorque,
                //         slipForMaxTorque: sg.slipForMaxTorque,
                //         ninetyPercentTorque: sg.ninetyPercentTorque,
                //         slipForNinetyPercentTorque: sg.slipForNinetyPercentTorque,
                //     })
                // }
            })
        })
    })
      
})