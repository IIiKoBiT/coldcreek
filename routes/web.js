const express = require('express');
const bodyParser = require('body-parser');
const App = require('./../app/Kernel');
const Router = express.Router();

bodyParser.urlencoded({extended: true});
bodyParser.json({extended: true});


Router.get('/api/data', App.controllers.api.getData);
Router.get('/api/email', App.controllers.api.testEmailSending);


module.exports = Router;

