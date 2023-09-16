class Flash_Data {
    static #data = null;

    static set (data) {
        if (data === this.#data) {
            return 0;
        } else {
            this.#data = data;
            return data;
        }
    }
}

module.exports = Flash_Data;