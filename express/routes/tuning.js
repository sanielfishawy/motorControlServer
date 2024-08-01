import express from 'express'
import * as LM from '../middleware/logMiddleware.js'
import * as Config from '../../config/config.js'
import Measurements from '../../models/tuning/Measurements.js';
import MeasurementStore from '../../models/tuning/MeasurementStore.js';

const router = express.Router();
export default router;

router.use(LM.logRequest())

router.get('/slipGroups', async (req, res) => {
    console.log('GET /tuning/slipGroups')
    const ms = await new MeasurementStore(Config.getDynamicTuningDataFile()).getMeasurementsAsArray()
    const measurements = new Measurements(ms)
    const slipGroups = measurements.slipGroups
    const results = slipGroups.map(sg => sg.paramsForUi)
    res.json({ok: true, results})
})
