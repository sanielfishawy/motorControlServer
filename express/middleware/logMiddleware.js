import Logger from '../../util/logger.js'

const logger = new Logger()

export function logRequest(){
    return function(req, res, next){
        logger.info(`${req.method} ${req.originalUrl}`)
        next()
    }
}