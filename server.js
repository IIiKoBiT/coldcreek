const express = require('express');
const bodyParser = require('body-parser');
const mailer = require('express-mailer');
const app  = express();
const path = require("path");
let env = process.env.NODE_ENV || "development";
let config = require(path.join(__dirname,'./', 'config', 'config.json'))[env];


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

app.use('/img',express.static('img'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.use(require('./routes/web'));

app.listen(3000, function () {
    console.log('running');
});