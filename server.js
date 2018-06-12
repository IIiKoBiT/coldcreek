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
    host: config.mail_client.host, // hostname
    secureConnection: true, // use SSL
    port: config.mail_client.port, // port for secure SMTP
    transportMethod: config.mail_client.transportMethod, // default is SMTP. Accepts anything that nodemailer accepts
    auth: config.mail_client.auth
});


cron.schedule(config.cronIntervalMask, function(){
    Cron.start(app);
});

app.use('/img',express.static('img'));

app.use(require('./routes/web'));

app.listen(3000, function () {
    console.log('running');
});