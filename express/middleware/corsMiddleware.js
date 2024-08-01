import Logger from "../../util/logger.js"
const logger = new Logger()

export function corsOptions(){
    return {
        origin: function (origin, callback){
            // Dangerous remove this in production. I only added it so I can hit this api from browser with no origin.
            // logger.info('Origin', {origin})
            callback(false, origin)
            return
            if(!origin) { 
                callback(false, origin)
                return
            }

            if (origin.includes('http://localhost') || origin.includes('slackdo.com')){
                callback(false, origin)
            } else {
                callback(true)
            }
        },
        credentials: true
    }
}