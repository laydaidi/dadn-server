const express = require('express');
const config = require('./config/server')
const app = express();

app.listen(config.port, () => {
    
});