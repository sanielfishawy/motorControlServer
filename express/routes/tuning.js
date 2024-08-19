import express from 'express'
import * as LM from '../middleware/logMiddleware.js'
import * as Config from '../../config/config.js'
import Measurements from '../../models/tuning/Measurements.js';
import MeasurementStore from '../../models/tuning/MeasurementStore.js';

const router = express.Router();
export default router;

router.use(LM.logRequest())

router.get('/slipGroups', (req, res) => {
    console.log('GET /tuning/slipGroups')
    const ms = new MeasurementStore('blue.yml').getMeasurementsAsArray()
    const measurements = new Measurements(ms)
    console.log(measurements.slipGroups)
    const results = measurements.paramsForUi
    res.json({ok: true, results})
})
