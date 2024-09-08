import express from 'express'
import * as LM from '../middleware/logMiddleware.js'
import * as MAPI from '../../api/esp32MotorApi.js'
import * as MController from '../../controllers/motorController.js'
import Logger from '../../util/logger.js'
const logger = new Logger()

const router = express.Router();
export default router;

router.use(LM.logRequest())

router.get('/status', async (req, res) => {
    logger.info('GET /motor/status')
    const r = await MAPI.getStatus()
    const j = await r.json()
    const results = MController.augmentedStatus(j)
    res.json({ok: true, results})
})
