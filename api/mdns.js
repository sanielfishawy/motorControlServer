import mdns from 'mdns'
import * as Config from '../config/config.js'

export default class MDNS{

    static motorIp = null

    static getMotorIp(timeout = 30000) {
        return new Promise((resolve, reject) => {

            if (this.motorIp) resolve(this.motorIp)

            const browser = mdns.createBrowser(mdns.tcp('http'));
    
            const timer = setTimeout(() => {
                browser.stop();
                reject(new Error('MDns: Service discovery timed out'));
            }, timeout);
    
            browser.on('serviceUp', service => {
                if (service.host === Config.getMotorMdnsName()) {
                    clearTimeout(timer);
                    browser.stop();
                    this.motorIp = service.addresses[0]
                    resolve(this.motorIp);
                }
            });
    
            browser.on('error', error => {
                clearTimeout(timer);
                browser.stop();
                reject(error);
            });
    
            browser.start();
        });
    }
}