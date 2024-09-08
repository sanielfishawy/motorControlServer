import express from 'express'
import * as LM from '../middleware/logMiddleware.js'
import Measurements from '../../models/tuning/Measurements.js';
import MeasurementStore from '../../models/tuning/MeasurementStore.js';
import Logger from '../../util/logger.js'
const logger = new Logger()

const router = express.Router();
export default router;

router.use(LM.logRequest())

router.get('/slipGroups', (req, res) => {
    logger.info('GET /tuning/slipGroups')
    const ms = new MeasurementStore('blue.yml').getMeasurementsAsArray()
    const measurements = new Measurements(ms)
    const results = measurements.paramsForUi
    res.json({ok: true, results})
})
