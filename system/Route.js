const fs = require('fs')
const { Profiler, router } = require('./Profiler');
const custom_route = require('../application/routes');
const { enable_profiler } = require('../application/config');
const Test = require('./Test');

class Route {
    static #controller_path = __dirname + '/../application/controllers';

    static generate_routes () {
        const controller = fs.readdirSync(this.#controller_path);

        let routes = [];
        for (let i in controller) {
            let controller_name = controller[i].split('.')[0];
            routes[routes.length] = controller_name;

            const require_controller = require('./../application/controllers/' + controller_name);
            let methods = Object.getOwnPropertyNames(require_controller.constructor.prototype);

            for (let j in methods) {
                const class_method = (methods[j] === 'index') ? '/' : '/' + methods[j];
                
                const system_method = ['contructor','__defineGetter__','__defineSetter__','hasOwnProperty','__lookupGetter__','__lookupSetter__','isPrototypeOf','propertyIsEnumerable','toString','valueOf','__proto__','toLocaleString'];
                
                let check_if_system_method = false;
                for (let k in system_method) {
                    if (methods[j] === system_method[k]) {
                        check_if_system_method = true; 
                    }
                }
                let profiler = 1;
                if (check_if_system_method === false) {
                    if (profiler === 1) profiler = 0;
                    
                    router.get(class_method, require_controller?.[methods[j]]);
                    router.post(class_method, require_controller?.[methods[j]]);
                }
            }
        }
        return this;
    }

    static custom_route () {
        for (let path in custom_route) {
            const controller_name = custom_route[path].split('/')[0];
            const method_name = custom_route[path].split('/')[1];

            const require_controller = require('./../application/controllers/' + controller_name);

            router.get(path, require_controller?.[method_name]);
            router.post(path, require_controller?.[method_name]);
        }
    }
}

Route.generate_routes().custom_route();

module.exports = { router };