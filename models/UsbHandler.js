import util from 'util'
import Logger from '../util/logger.js'
import {sleep} from '../util/sleep.js'
import {usb, getDeviceList} from 'usb'

const logger = new Logger();
export default class UsbHandler {
    static CDC_INTERFACE_CLASS = 10
    static stmComDevice = null
    static initalized = false
    static _incomingDataSubscriber = null
    static _incomingErrorSubscriber = null

    static init() {
        if (this.initalized) return

        usb.on('attach', async (device) => {
            await this.handleAttach(device)
        })

        usb.on('detach', async (device) => {
            await this.handleDetach(device)
        })

        logger.info('Waiting for usb devices to be attached/detached...')
        this.initalized = true
    }

    /**
     * @param {usb.Device} device 
     */
    static async handleAttach(device) {
        const details = await this.getDeviceDetails(device)
        if (details.product.ok && details.product.results.includes('STM32 Virtual ComPort')) {
            logger.info('Attached')
            logger.debug(util.inspect(details, true, 1, true))
            this.stmComDevice = {device, details}
            let r = await this.startPolling()
            logger.info('Started polling:', r)  
        }
    }

    /**
     * @param {usb.Device} device 
     */
    static async handleDetach(device) {
        if (!this.stmComDevice) return logger.info('Detached unknown device')

        if ( device.deviceDescriptor.idVendor == this.stmComDevice.device.deviceDescriptor.idVendor && 
             device.deviceDescriptor.idProduct == this.stmComDevice.device.deviceDescriptor.idProduct) {

            logger.info('Detached stm32 virtual com port device')
            this.stmComDevice = null
        
        } else {
            logger.info('Detached NON stm com port device')
        }
    };

    static set incomingDataSubscriber(subscriber) {
        this._incomingDataSubscriber = subscriber
    }

    static get incomingDataSubscriber() {
        return this._incomingDataSubscriber
    }

    static handleIncomingData(data) {
        logger.debug('Received data:', data.toString('utf-8'))
        if (UsbHandler.incomingDataSubscriber) UsbHandler.incomingDataSubscriber(data)
    }

    static set incomingErrorSubscriber(subscriber) {
        this._incomingErrorSubscriber = subscriber
    }

    static get incomingErrorSubscriber() {
        return this._incomingErrorSubscriber
    }

    static handleIncomingError(error) {
        logger.error('Received error:', error)
        if (UsbHandler.incomingErrorSubscriber) UsbHandler.incomingErrorSubscriber(error)
    }

    static handleIncomingEnd() {
        logger.info('Received end of polling')
    }

    static async startPolling(){
        if(!this.stmComDevice) return {ok: false, error: 'Cant start polling. No stm com device'}

        this.stmComDevice.device.open()

        let r = this.claimCdcInterface()
        if(!r.ok) return {ok: false, error: r}
        
        r = this.stmComDevice.details.cdcInEndpoint
        if (!r?.ok) return {ok: false, error: r}
        const inEndpoint = r.results

        inEndpoint.startPoll()

        inEndpoint.on('data', this.handleIncomingData)
        inEndpoint.on('error', this.handleIncomingError)
        inEndpoint.on('end', this.handleIncomingEnd)
        
        return {ok: true}
    }


    static async sendString(str) {
        if(!this.stmComDevice) return this.sendStringError('Cant send string. No stm com device')

        this.stmComDevice.device.open()

        let r = this.claimCdcInterface()
        if(!r.ok) return this.sendStringError(r.error)

        r = this.stmComDevice.details.cdcOutEndpoint
        if (!r?.ok) return this.sendStringError(r.error)
        const outEndpoint = r.results

        const data = Buffer.from(str, 'utf-8')

        return new Promise((resolve, reject) => {
            outEndpoint.transfer(data, (error) => {
                if (error) {
                    resolve({ok: false, error})
                } else {
                    resolve({ok: true})
                }
            })
        })
    }

    static async sendStringError(error) {
        return new Promise((resolve, reject) => {
            resolve({ok: false, error})
        })
    }


    static claimCdcInterface() {
        let r = this.stmComDevice?.details?.cdcInterface
        if (!r?.ok) return {ok: false, error: r}
        const cdcInterface = r.results
        cdcInterface.claim()
        return {ok: true}
    }


    /**
     * @param {usb.Device} device 
     */
    static async getDeviceDetails(device) {
        const manufacturer = await this.getDeviceManufacturer(device) 
        const product = await this.getDeviceProduct(device)
        const capabilities = await this.getCapabilities(device)
        const interfaces = await this.getInterfaces(device) 
        const cdcInterface = await this.getCdcInterface(device)
        const cdcEndpoints = await this.getCdcEncpoints(device)
        const cdcInEndpoint = await this.getCdcInEnpoint(device)
        const cdcOutEndpoint = await this.getCdcOutEnpoint(device)
        return {manufacturer, product, capabilities, interfaces, cdcInterface, cdcEndpoints, cdcInEndpoint, cdcOutEndpoint}
    }

    /**
     * @param {usb.Device} device 
     */
    static async getDeviceProduct(device) {
        return this.getStringDescriptor(device, device.deviceDescriptor.iProduct)
    }

    /**
     * @param {usb.Device} device 
     */
    static async getDeviceManufacturer(device) {
        return this.getStringDescriptor(device, device.deviceDescriptor.iManufacturer)
    }
    
    /**
     * @param {usb.Device} device 
     * @param {*} deviceStringDescriptor 
     */
    static async getStringDescriptor(device, deviceStringDescriptor){
        return new Promise((resolve, reject) => {
            device.open()
            device.getStringDescriptor(deviceStringDescriptor, (error, results) => {
                if (error) {
                    device.close()
                    resolve({ok: false, error})
                } else {
                    device.close()
                    resolve({ok: true, results})
                }
            });
        })
    
    }

    /**
     * @param {usb.Device} device 
     */
    static async getCapabilities(device) {
        return this.callDeviceMethod(device, 'getCapabilities')
    }

    static async getCdcInEnpoint(device) {
        const r = await this.getCdcEncpoints(device)
        if(!r.ok) return {ok: false, error: r}
        const endpoints = r.results
        return  {ok: true, results: endpoints.find(e => e.direction == 'in')}
    }
    
    static async getCdcOutEnpoint(device) {
        const r = await this.getCdcEncpoints(device)
        if(!r.ok) return {ok: false, error: r}
        const endpoints = r.results
        return  {ok: true, results: endpoints.find(e => e.direction == 'out')}
    }

    static async getCdcEncpoints(device) {
        const r = await this.getCdcInterface(device)
        if(!r.ok) return {ok: false, error: r}
        const cdcInterface = r.results
        const endpoints = cdcInterface.endpoints
        return {ok: true, results: endpoints}
    }

    static async getCdcInterface(device) {
        const r = await this.getInterfaces(device)
        if(!r.ok) return {ok: false, error: r}
        const interfaces = r.results
        const cdcInterface = interfaces.find(i => i.descriptor.bInterfaceClass == this.CDC_INTERFACE_CLASS)
        if (!cdcInterface) return {ok: false, error: 'No CDC interface found'}
        return {ok: true, results: cdcInterface}
    }

    static async getInterfaces(device) {
        const r = await this.getCapabilities(device)
        if (!r.ok) return {ok: false, error: r}
        const capability = r.results[0]
        return {ok: true, results: capability.device.interfaces}
    }

    /**
     * @param {usb.Device} device 
     */
    static async callDeviceMethod(device, deviceMethod) {
        return new Promise((resolve, reject) => {
            if (!device || !deviceMethod) resolve({ok: false, error: 'No device'})
            device.open()
            device[deviceMethod]( (error, results) => {
                if (error) {
                    resolve({ok: false, error})
                } else {
                    resolve({ok: true, results})
                }
            });
        })
    }

}

