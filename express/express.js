import express from 'express'
import cors from 'cors'
import * as CM from './middleware/corsMiddleware.js'
import tuningRouter from './routes/tuning.js'
import motorRouter from './routes/motor.js'
import * as Config from '../config/config.js'
import * as DC from '../config/displayConfig.js'
import Logger from '../util/logger.js'
const logger = new Logger()

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
app.use('/motor', motorRouter)


export function startServer(){
    return app.listen(Config.getPort(), () => {
        logger.info(`Server started on port ${Config.getPort()}. ${Config.getLocalDomain()}:${Config.getPort()}`)
    }).on('error', function(error){
        if (error.code === 'EADDRINUSE'){
            logger.error(`WARNING: ${Config.getNormalizedEnvironment()} server already running.`)
        } else {
            logger.error('Error starting Express Server', {error})
        }
    })
}

export function stopServer(server){
    server.close()
}

