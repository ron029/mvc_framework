const fs = require('fs');

class Validate {

    // Store errors.
    static #errors = [];
    // Form validation file path.
    static #form_validation_file = __dirname + '/../application/form_validation.json';

    /**
     * import the POST data then process validation.
     * @param {*} data 
     */
    static input (data, rule_name = 0) {
        // Reset error value.
        this.#errors = [];
        // Sanitize POST values.
        let user_data = [];
        for (let i=0; i<Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            user_data[user_data.length] = { key: this.sanitize(data[key]) }; 
        }

        if (this.get_validation_file() !== false) {
            let rules = this.get_validation_file();

            if (rules.length > 1) {
                for (let i=0; i<rules.length; i++) {
                    if (rules[i][rule_name]) {
                        for (let j=0; j<rules[i][rule_name].length; j++) {
                            let value = data[rules[i][rule_name][j][0].field];
                            let label = rules[i][rule_name][j][1].label;
                            let rule = rules[i][rule_name][j][2].rules.split('|');

                            // Loop through field with more than one rules.
                            for (let k=0; k<rule.length; k++) {
                                if (rule[k] === "required") {
                                    if (this.required(value, label) === true) break;
                                } else if (rule[k] === "email") {
                                    this.email(value, label);
                                } else if (rule[k] === "alpha_space") {
                                    this.alpha_space(value, label);
                                } else if (rule[k].startsWith("min")) {
                                    this.min(value, label, rule[k]);
                                } else if (rule[k].startsWith('matches')) {
                                    this.matches(value, rule[k], data);
                                }
                            }
                        }
                    }
                }
            } else {
                /**
                 * TODO:
                 * Code for 1 group of data validation
                 */
            }
        }
        if (this.#errors.length > 0) {
            return true;
        }        
        return false;
    }

    /**
     * Check if the form_validation.js exist that contains the set of rules.
     * @returns false if not, otherwise return the data.
     */
    static get_validation_file () {
        if (fs.existsSync(this.#form_validation_file) !== true) {
            return false;
        } else {
            try {
                const data = fs.readFileSync(this.#form_validation_file, 'utf-8');
                return JSON.parse(data);
            } catch (err) {
                console.error(err);
            }
        }
    }

    static msg (msg) {
        this.#errors[0] = msg;
    }

    /**
     * Escape the strings.
     * @param {*} input 
     * @returns 
     */
    static sanitize (input) {
        // TODO:
        // Create sanitation techniques.
        return `${input}`;
    }
    
    /**
     * Validate field with proper value
     * @param {*} value 
     * @param {*} label 
     */
    static required (value, label) {
        let new_value = value.trim();
        if (new_value === "" || new_value === null) {
            this.#errors[this.#errors.length] = `${label} field is required`;
            return true;
        }
        return false;
    }

    /**
     * Validate Email Address format. Can accept letter, number, '.', '@'.
     * @param {*} value 
     * @returns 
     */
    static email (value) {
        let count_at = 0;
        for (let i=0; i<value.length; i++) {
            if (value[i] === '@') {
                count_at++;
            }
            
            if (value[i] === value[i].toUpperCase() && !(value[i]*1 >= 0) && value[i] !== '@' && value[i] !== '.' || value[i] === ' ') {
                this.#errors[this.#errors.length] = `Invalid Email Address format`;
                return;
            }
        }

        if (count_at !== 1) {
            this.#errors[this.#errors.length] = `Invalid Email Address format`;
        }
    }
    
    /**
     * Validate field only if is it Alphabet or Space characters.
     * @param {*} value 
     * @param {*} label 
     * @returns 
     */
    static alpha_space (value, label) {
        for (let i=0; i<value.length; i++) {
            if (value[i] === value[i].toUpperCase() && value[i] !== ' ') {
                this.#errors[this.#errors.length] = `${label} field can accept Alphabet`;
                return;
            }
        }
    }

    /**
     * Validate field if it is matches with other field.
     * @param {*} value 
     * @param {*} rule 
     * @param {*} data 
     */
    static matches (value, rule, data) {
        let to_match = rule.substring(rule.indexOf("(")+1,rule.lastIndexOf(')'));
        if (data[to_match] !== value) {
            this.#errors[this.#errors.length] = `Password not match`;
        }
    }

    /**
     * Validate field if it is in minimum character.
     * @param {*} value 
     * @param {*} label
     * @param {*} rule 
     */
    static min (value, label, rule) {
        let num = rule.substring(rule.indexOf("(")+1,rule.lastIndexOf(')'));
        if (num > value.length) {
            this.#errors[this.#errors.length] = `${label} field must be atleast ${num} characters long`;
        }
    }

    /**
     * Compile and save all the errors.
     * @returns
     */
    static validation_errors () {
        return this.#errors;
    }
}

module.exports = Validate;