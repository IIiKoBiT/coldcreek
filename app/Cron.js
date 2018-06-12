const phantom = require('phantom');
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'./../', 'config', 'config.json'))[env];
const Waitino = require('./Models/index').data_waitino_take_aggregate;
const Weka = require('./Models/index').data_weka_take_aggregate;
const sequelize = require('./Models/index').sequelize;
const Sequelize = require('./Models/index').Sequelize;



const Cron = {

    start: async function(app)
    {
        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open(config.pageUrlToGetImage);
        await page.property('content');

        const filename = Date.now()+'chart.png';
        page.render('./img/'+filename);

        instance.exit();

        app.mailer.send('email', {
            image: 'http://localhost:3000/img/'+filename,
            to: 'avadakkeddavra@gmail.com',
            subject: 'Test Email',
            otherProperty: 'Other Property',
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Email sent');
        });
    },
    checkData: async function(app){

        let weka = await sequelize.query('SELECT sum(`value`) AS `sum` FROM (SELECT * FROM `data_weka_take_aggregate` AS `data_weka_take_aggregate` ORDER BY `data_weka_take_aggregate`.`date` DESC LIMIT 4)  AS `sum`',{
            type:Sequelize.QueryTypes.SELECT,
            raw:true
        });


        let waitino = await sequelize.query('SELECT sum(`value`) AS `sum` FROM (SELECT * FROM `data_waitino_take_aggregate` AS `data_waitino_take_aggregate` ORDER BY `data_waitino_take_aggregate`.`date` DESC LIMIT 4)  AS `sum`',{
            type:Sequelize.QueryTypes.SELECT,
            raw:true
        });

        console.log(weka[0]['sum']);

        if(config.wekaTrigger && weka[0]['sum'] == 0)
        {
            app.mailer.send('emailChecking', {
                item:"weka",
                to: config.mail_client.receiverEmail,
                subject: 'Test Email',
                otherProperty: 'Other Property',
            }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Email sent');
            });
        }

        if(config.waitinoTrigger &&  waitino[0]['sum'] == 0)
        {
            app.mailer.send('emailChecking', {
                item:"waitino",
                to: 'avadakkeddavra@gmail.com',
                subject: 'Test Email',
                otherProperty: 'Other Property',
            }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Email sent');
            });
        }

    }

};

module.exports = Cron;