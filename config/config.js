// Config should have no dependencies on other modules.
// Config is required by loadSecrets and secrets. 
// loadSecrets must run first and any dependencies on Config would therefore
// be loaded before secrets are loaded which may be undesirable.

import MDNS from '../api/mdns.js'

const MOTOR_MDNS_NAME = 'motor.local.'

export function getMotorMdnsName(){
    return MOTOR_MDNS_NAME
}

export async function getMotorIp(){
    return MDNS.getMotorIp()
}

export async function getMotorApiIpUrl(){
    return `http://${await getMotorIp()}`
}

export function getLocalDomain(){
    return `http://localhost`
} 

export const ENV_DEVELOPMENT = 'development'
export const ENV_PRODUCTION = 'production'
export const ENV_STAGING = 'staging'
export const ENV_TEST = 'test'

export function getTestPath(path){
    const url = getTestUrl()
    url.pathname = path
    return url
}

export function getTestUrl(){
    const url = new URL(process.env.TEST_DOMAIN || getLocalDomain())
    url.port = getPort()
    return url
}

export function getPort(){
    return process.env.PORT || 8000
}

export function getRawEnvironment(){
    const env = process.env.ENV || process.env.ENVIRONMENT || 'development'
    return env?.toLowerCase()
}

export function isDevelopment(){
    return getRawEnvironment().includes('dev')
}

export function isTest(){
    return getRawEnvironment().includes('test')
}

export function isStaging(){
    return getRawEnvironment().includes('stag')
}

export function isProduction(){
    return getRawEnvironment().includes('prod')
}

export function getNormalizedEnvironment(){
    if (isDevelopment()) return 'development'
    if (isTest()) return 'test'
    if (isStaging()) return 'staging'
    if (isProduction()) return 'production'
}

export function getAbbrEnvironment(){
    if (isDevelopment()) return 'dev'
    if (isTest()) return 'test'
    if (isStaging()) return 'stage'
    if (isProduction()) return 'prod'
}

export function getDynamicTuningDataFile(){
    if (isTest()) return 'testTuning.yml'
    return 'dynamicTuning.yml'
}