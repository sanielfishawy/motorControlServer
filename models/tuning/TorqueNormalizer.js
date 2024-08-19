export default class TorqueNormalizer{

    constructor(paramsForUi, maxTorqueSetting=1){
        this.paramsForUi = paramsForUi
        this.maxTorqueSetting = maxTorqueSetting
        this._torques = null
        this._maxTorque = null
    }

    get torques(){
        if (!this._torques){
            this._torques = []
            for (const sgParams of this.paramsForUi){
                for (const tp of sgParams.slipTorquePoints){
                    this._torques.push(tp.torque)
                }
            }
        }
        return this._torques
    }

    get maxTorque(){
        if (!this._maxTorque){
            this._maxTorque = Math.max(...this.torques)
        }
        return this._maxTorque
    }

    get torqueMultiplier(){
        if (!this._maxTorqueMultiplier){
            this._maxTorqueMultiplier = this.maxTorqueSetting / this.maxTorque 
        }
        return this._maxTorqueMultiplier
    }

    getNormalizedTorquePoints(rawTorquePoints){
        return rawTorquePoints.map(tp => {
            return {slipFract: tp.slipFract, torque: tp.torque * this.torqueMultiplier}
        })
    }

    get normalizedParamsForUi(){
        return this.paramsForUi.map(sgParams => {
            return {
                minFreqHz: sgParams.minFreqHz,
                maxFreqHz: sgParams.maxFreqHz,
                amplitudeFract: sgParams.amplitudeFract,
                slipForMaxTorque: sgParams.slipForMaxTorque,
                slipForNinetyPercentTorque: sgParams.slipForNinetyPercentTorque,
                maxTorque: sgParams.maxTorque * this.torqueMultiplier,
                ninetyPercentTorque: sgParams.ninetyPercentTorque * this.torqueMultiplier,
                slipTorquePoints: this.getNormalizedTorquePoints(sgParams.slipTorquePoints)
            }
        })
    }

}