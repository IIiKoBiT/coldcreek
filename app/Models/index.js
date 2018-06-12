let fs = require('file-system');
let path = require("path");
let Sequelize = require("sequelize");
let env = process.env.NODE_ENV || "development";
let config = require(path.join(__dirname,'../..', 'config', 'config.json'))[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        let model = sequelize.import(path.join(__dirname, file));

        db[model.name] = model;
    });


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;