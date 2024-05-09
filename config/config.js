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