import Measurement from './Measurement.js'

export default class SlipGroup{

    /**
     * @param {[Measurement]} measurements 
     */
    constructor(measurements){
        this.measurements = measurements
    }

    get slips(){
        return this.measurements.map(m => m.slipFract).sort()
    }

    get torques(){
        return this.measurements.map(m => m.torque)
    }

    get maxTorque(){
        return Math.max(...this.torques)
    }

    get slipForMaxTorque(){
        return this.measurements.find(m => m.torque === this.maxTorque).slipFract
    }

    get ninetyPercentTorque(){
        return this.maxTorque * 0.9
    }   

    get slipForNinetyPercentTorque(){
        for(let slip of this.slips){
            const torque = this.measurements.find(m => m.slipFract === slip).torque
            if(torque >= this.ninetyPercentTorque) return slip
        }
    }

    get minFreq(){
        if(!this.measurements[0]) console.log(this)
        return this.measurements[0].minFreqHz
    }
    
    get maxFreq(){
        return this.measurements[0].maxFreqHz
    }

    get amplitudeFract(){
        return this.measurements[0].amplitudeFract
    }

    get slipTorquePoints(){
        return this.measurements.map(m => { return {slipFract: m.slipFract, torque: m.torque} })
    }

    get paramsForUi(){
        return {
            minFreqHz: this.minFreq,
            maxFreqHz: this.maxFreq,
            amplitudeFract: this.amplitudeFract,
            slipForMaxTorque: this.slipForMaxTorque,
            slipForNinetyPercentTorque: this.slipForNinetyPercentTorque,
            maxTorque: this.maxTorque,
            ninetyPercentTorque: this.ninetyPercentTorque,
            slipTorquePoints: this.slipTorquePoints,
        }
    }
}