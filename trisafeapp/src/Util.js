export default class Util {
    
    getURL(metodo){
        protocol = 'https://';
        domain = 'despertadorappd.herokuapp.com';

        if (__DEV__) {
            protocol = 'http://';
            //  domain = '10.0.0.105:8000';
            //domain = '192.168.0.6:8000';
            domain = '192.168.0.4:8000';
        }
        return protocol + domain + metodo;
    }
}