import * as chai from 'chai'

import Logger from '../util/logger.js'

describe('Logger.js', () => {
    describe('info()', () => {
        it('Should log an info message', () => {
            const logger = new Logger()
            logger.info('This is an info message', {foo:'bar'})
        })
    })
})