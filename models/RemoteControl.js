import _ from 'lodash'
import Logger from '../util/logger.js'
import UsbHandler from "./UsbHandler.js"

const logger = new Logger()
export default class RemoteControl{

    static commands = {}

    static init(){
        UsbHandler.init()
        UsbHandler.incomingDataSubscriber = this.handleIncomingData
        UsbHandler.incomingErrorSubscriber = this.handleIncomingError
    }

    static deInit(){
        UsbHandler.incomingDataSubscriber = null
        UsbHandler.incomingErrorSubscriber = null
    }

    /**
     * @param {{}} commandObject 
     */
    static async transmit(commandObject){
        if(!_.isObject(commandObject)) return this.transmitError('Command object must be a js object.')

        const command = this.addCommand(commandObject)
        const responsePromise = await command.transmit()

        // Remove the command here if there is an error since there will not be a response to remove it.
        if (command.error)
            this.removeCommand(command)

        return responsePromise
    }

    static async transmitError(error){
        return new Promise((resolve, reject) => {
            resolve({ok: false, error})
        })
    }

    static addCommand(commandObject){
        const command = new RemoteControlCommand(commandObject)
        this.commands[command.id] = command
        return command
    }

    static removeCommand(command){
        delete this.commands[command.id]
    }

    static handleIncomingData(data){
        let response
        try {
            response = JSON.parse(data.toString('utf-8'))
        } catch (error) {
            return (logger.error(error))
        }

        const id = response?.id
        if (!id) return logger.error('Incoming data has no id:', response)

        const command = RemoteControl.commandWithId(id)
        if (!command) return logger.error('No command found for incoming data:', response)

        command.handleResponse(response)
        RemoteControl.removeCommand(command)
    }

    static handleIncomingError(error){
    }

    static commandWithId(id){
        return this.commands[id]
    }
}

export class RemoteControlCommand{
    constructor(commandObject){
        this.commandObject = commandObject
        this.id = new Date().getTime()
        this.transmitted = false
        this.error = null
        this.response = null
        this.responsePromise = new Promise( (resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    async transmit(){
        if(this.transmitted){
            this.handleError('Command already transmitted')
            return this.responsePromise
        }

        this.commandObject.id = this.id

        let json
        try {   
            json = JSON.stringify(this.commandObject)
        } catch (error) {
            this.handleError({message: 'Failed to stringify command object', commandObject})
            return this.responsePromise
        }

        let r = await UsbHandler.sendString(json)
        if (!r.ok) {
            this.handleError(r.error)
            return this.responsePromise
        }

        this.transmitted = true
        
        return this.responsePromise
    }

    handleResponse(response){
        this.response = response
        this.resolve({ok: true, results: this.response})
    }

    handleError(error){
        this.error = error
        this.resolve({ok: false, error: this.error})
    }

    async testResolveReject(){
        return this.responsePromise
    }

}
