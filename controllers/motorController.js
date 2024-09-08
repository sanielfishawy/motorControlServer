export function augmentedStatus(status){
    const amp = status.amplitudeFract
    const freq = status.freqHz
    const actTorque = actualTorqueFromParabolicModel(freq, amp)
    return {
        ...status,
        actTorque,
    }
}

export function actualTorqueFromParabolicModel(freq, amp){
    const pm = parabolicModel();
    if (freq < pm.lowCutoffRotorFreq) return amp / 0.75;
    
    const k =   pm.a * freq * freq + 
                pm.b * freq + 
                pm.c;
    return amp / k;
}

export function parabolicModel(){
    return{
        lowCutoffRotorFreq: 3,
        a:  0.0087,
        b: -0.1443,
        c:  1.708,
    }
}