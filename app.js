const app = require('express')();
const loader = require('./loaders/main');
const routes = require('./api-routes/main');

loader.init(app);
routes.init(app);

app.listen(process.env.PORT, () => {
    console.log(`This server is running at port ${process.env.PORT}`);
});