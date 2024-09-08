export default class BlueZeroTorqueLimits{

    static hasZeroTorque(freqHz, amplitudeFract){
        if (freqHz >= 2 && amplitudeFract <= 0.1)
            return true
        else if (freqHz >= 10 && amplitudeFract <= 0.3)
            return true
        else if (freqHz >= 18 && amplitudeFract <= 0.4)
            return true
        else if (freqHz >= 26 && amplitudeFract <= 0.5)
            return true
        else if (freqHz >= 30 && amplitudeFract <= 0.6)
            return true
        else if (freqHz >= 38 && amplitudeFract <= 0.7)
            return true
        else
            return false
    }


}