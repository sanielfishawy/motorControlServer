import express from 'express'
import cors from 'cors'
import * as CM from './middleware/corsMiddleware.js'
import tuningRouter from './routes/tuning.js'
import * as Config from '../config/config.js'
import * as DC from '../config/displayConfig.js'
import { logMessageAndObj } from '../logging/logger.js'

export const app = express()

app.set('trust proxy', true)

app.use(cors(CM.corsOptions()))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE, OPTIONS')
    next()
})

app.get('/', async (req, res) => {
    const status = await DC.displayConfiguration()
    res.json(status)
})

app.get('/status', async (req, res) => {
    const status = await DC.displayExtendedConfiguration()
    res.json(status)
})

app.use('/tuning', tuningRouter)

export function startServer(){
    return app.listen(Config.getPort(), () => {
        logMessageAndObj(`Server started on port ${Config.getPort()}. ${Config.LOCAL_DOMAIN}:${Config.getPort()}`)
    }).on('error', function(error){
        if (error.code === 'EADDRINUSE'){
            logMessageAndObj(`WARNING: ${Config.getNormalizedEnvironment()} server already running.`, {}, 'warn')
        } else {
            logMessageAndObj('Error starting Express Server', {error}, 'error')
        }
    })
}

export function stopServer(server){
    server.close()
}

