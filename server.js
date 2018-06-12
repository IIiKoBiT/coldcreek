const express = require('express');
const mailer = require('express-mailer');
const app  = express();
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'./', 'config', 'config.json'))[env];
const cron = require('node-cron');
const Cron = require('./app/Cron');

app.set('views', './views');
app.set('view engine', 'pug');

mailer.extend(app, {
    from: config.mail_client.email,
    host: config.mail_client.host,
    secureConnection: true,
    port: config.mail_client.port,
    transportMethod: config.mail_client.transportMethod,
    auth: config.mail_client.auth
});


cron.schedule(config.cronIntervalMask, function(){
    Cron.start(app);
});

cron.schedule("2 * * * *", function(){
    Cron.checkData(app);
});

app.use('/img',express.static('img'));

app.use(require('./routes/web'));

app.listen(3000, function () {
    console.log('running');
});