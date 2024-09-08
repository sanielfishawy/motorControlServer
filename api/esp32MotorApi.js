import * as HttpParams from './httpParams.js'
import * as Config from '../config/config.js'

export async function getStatus() {
    return getRequest('/')
}

export async function getFreqHz() {
    return getRequest('/freqHz')
}

export async function setFreqHz(value) {
    return putRequest('/freqHz', {value})
}

export async function getAmplitudeFract() {
    return getRequest('/amplitudeFract')
}

export async function setAmplitudeFract(value) {
    return putRequest('/amplitudeFract', {value})
}

export async function setActive() {
    return putRequest('/setActive')
}

export async function setFloat() {
    return putRequest('/setFloat')
}

export async function getIsActive() {
    return getRequest('/isActive')
}

export async function setDynamicMeasurement(measurement){
    return postRequest('/setDynamicMeasurement', measurement)
}

export async function getDynamicMeasurement(){
    return getRequest('/getDynamicMeasurement')
}

export async function getUseGoPedal(){
    return getRequest('/useGoPedal')
}

export async function setUseGoPedal(value){
    return putRequest('/useGoPedal', {value})
}

export async function getTorque(){
    return getRequest('/torque')
}

export async function setTorque(value){
    return putRequest('/torque', {value})
}

export async function getGoPedalStatus(){
    return getRequest('/goPedalStatus')
}

async function getRequest(endpoint, params={}){
    return getOrPutRequest(endpoint, params, 'GET')
}

async function putRequest(endpoint, params={}){
    return getOrPutRequest(endpoint, params, 'PUT')
}

async function getOrPutRequest(endpoint, params={}, method='GET'){
    const url = await getUrl(endpoint)

    const search = new URLSearchParams()
    for (const [key, val] of (Object.entries(params))){
        search.set(key, val)
    }
    url.search = search
    return fetch(
        url,
        {
            headers: getHeaders(),
            method,
        }
    )
}

async function postRequest(endpoint, params){
    return postOrPatchRequest(endpoint, params, 'POST')
}

async function patchRequest(endpoint, params){
    return postOrPatchRequest(endpoint, params, 'PATCH')
}

async function postOrPatchRequest(endpoint, params={}, method='POST'){
    const url = await getUrl(endpoint)
    return fetch(
        url,
        {
            headers: getHeaders(),
            body: JSON.stringify(params),
            method,
        }
    )
}

async function getUrl(endpoint){
    return new URL(endpoint, await Config.getMotorApiIpUrl())
}

function getHeaders(){
    return HttpParams.headersNoAuth()
}
