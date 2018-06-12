const phantom = require('phantom');
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'./../', 'config', 'config.json'))[env];

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
    }

};

module.exports = Cron;