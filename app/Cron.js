const phantom = require('phantom');
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'./../', 'config', 'config.json'))[env];
const Waitino = require('./Models/index').data_waitino_take_aggregate;
const Weka = require('./Models/index').data_weka_take_aggregate;

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

        let weka = await Weka.findAll({
            order:[
                ['date','DESC'],
            ],
            limit:4
        });

        let waitino = await Waitino.findAll({
            order:[
                ['date','DESC'],
            ],
            limit:4
        });

        let wekaCounter = 0;
        let waitinoCounter = 0;
        for(let i = 0; i < 4; i++)
        {
            if(weka[i].value == 0)
            {
                wekaCounter++;
            }

            if(waitino[i].value == 0){
                waitinoCounter++;
            }
        }

        if(wekaCounter == 4 || waitinoCounter == 4)
        {
            app.mailer.send('emailChecking', {
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