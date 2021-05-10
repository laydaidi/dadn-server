const express = require('express');

class Loader {
    constructor() {}
    init(app) {
        require('dotenv').config();
        app.use(express.json());
    }
}


module.exports = new Loader();