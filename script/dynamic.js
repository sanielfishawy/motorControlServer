import * as MAPI from '../api/esp32MotorApi.js'
console.log('Dynamic measurement test')

const r = await MAPI.setDynamicMeasurement({
    minFreqHz: 4,
    maxFreqHz: 10,
    slipFract: 0.2,
    amplitudeFract: 0.7,
})

const j = await r.json()
console.log(j)

while (true) {
    const r = await MAPI.getDynamicMeasurement()
    const j = await r.json()
    console.log(j)
    await new Promise(resolve => setTimeout(resolve, 1000))
}