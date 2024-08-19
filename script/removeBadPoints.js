import MeasurementStore from '../models/tuning/MeasurementStore.js' 

const points = [
    { minFreqHz:18,  slipFract:0.16, amplitudeFract:0.3 },
    { minFreqHz:18,  slipFract:0.22, amplitudeFract:0.5 },
    { minFreqHz:22,  slipFract:0.20, amplitudeFract:0.6 },
    { minFreqHz:22,  slipFract:0.20, amplitudeFract:0.6 },
    { minFreqHz:26,  slipFract:0.11, amplitudeFract:0.3 },
    { minFreqHz:26,  slipFract:0.11, amplitudeFract:0.4 },
    { minFreqHz:30,  slipFract:0.08, amplitudeFract:0.4 },
    { minFreqHz:34,  slipFract:0.18, amplitudeFract:0.4 },
    { minFreqHz:34,  slipFract:0.18, amplitudeFract:0.9 },
    { minFreqHz:34,  slipFract:0.18, amplitudeFract:0.9 },
]

const ms = new MeasurementStore('blue.yml')
const measurements = ms.getMeasurementsAsInstanceOfMeasurements()

for (const p of points){
    const m = measurements.withMinFreqAmpAndSlip(p.minFreqHz, p.amplitudeFract, p.slipFract)
    if(m.length > 1){
        console.log('Multiple measurements found skipping: ', m)
        continue
    }
    if(m.length === 0){
        console.log('No measurements found for: ', p, ' skipping')
        continue
    }
    ms.removeMeasurement(m[0])
}

