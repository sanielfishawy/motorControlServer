import * as LM from '../middleware/logMiddleware.js'

const router = express.Router();
export default router;

router.use(LM.logRequest())

router.get('/problem_trends', async (req, res) => {
    const results = await new PowerSystemProblems().problemCountsByProblemIdAndBatchTime()
    res.json({ok: true, results})
})
