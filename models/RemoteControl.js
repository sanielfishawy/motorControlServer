import UsbHandler from "./UsbHandler.js"

export default class RemoteControl{

    static commands = []

    static init(){
        UsbHandler.init()
        UsbHandler.incomingDataSubscriber = this.handleIncomingData
        UsbHandler.incomingErrorSubscriber = this.handleIncomingError
    }

    static async transmit(commandObject){
        const command = this.addCommand(commandObject)
        return command.transmit()
    }

    static addCommand(commandObject){
        const command = new RemoteControlCommand(commandObject)
        this.commands.push(command)
        return command
    }

    static handleIncomingData(data){
        try {
            console.log('Handle')
            const response = JSON.parse(data.toString('utf-8'))
            const id = response.id
            if (!id) return console.log('Incoming data has no id:', response)
            const command = RemoteControl.commandWithId(id)
            if (!command) return console.log('No command found for incoming data:', response)
            command.response = response
            command.resolve( {ok: true, results: response} )
        } catch (error) {
            console.log(error)
        }
    }

    static handleIncomingError(error){
    }


    static get commandsWithNoResponse(){
        return this.commands.filter(c => !c.response)
    }

    static get commandsWithError(){
        return this.commands.filter(c => c.error)
    }

    static commandWithId(id){
        return this.commands.find(c => c.id === id)
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
        if(this.transmitted) this.resolve( {ok: false, error: 'Command already transmitted'} )

        this.commandObject.id = this.id

        let json
        try {   
            json = JSON.stringify(this.commandObject)
        } catch (error) {
            this.error = 'Failed to stringify command object'
            this.resolve( {ok: false, error: this.error} )
        }

        let r = await UsbHandler.sendString(json)
        if (!r.ok) {
            this.error = r.error
            this.resolve( {ok: false, error: this.error} )
        }
        
        return this.responsePromise
    }

    async testResolveReject(){
        return this.responsePromise
    }

}
