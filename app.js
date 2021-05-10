const express = require('express');
const config = require('./config/server');
const routes = require('./api-routes/main');
const app = express();

routes.init(app);

app.listen(config.port, () => {
    console.log(`This server is running at port ${config.port}`);
});