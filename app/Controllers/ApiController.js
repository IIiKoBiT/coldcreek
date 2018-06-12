const Waitino = require('./../Models/index').data_waitino_take_aggregate;
const Weka = require('./../Models/index').data_weka_take_aggregate;
const phantom = require('phantom');
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'./../../', 'config', 'config.json'))[env];

const ApiController = {

    getData: async function(request,response)
    {

      ApiController.cors(response);

      let weka = await Weka.findAll({
          order:[
              ['date','DESC'],
          ],
          limit:24
      });

      let waitino = await Waitino.findAll({
          order:[
              ['date','DESC'],
          ],
          limit:24
      });


      let data = [];

      for(let i = 0; i < 24; i++)
      {
          let date = ApiController.formatDate(waitino[i].date);

          let item = {
              time:date,
              we: Math.ceil(weka[i].value),
              wa: Math.ceil(waitino[i].value)
          };

          data.push(item);
      }

      response.send(data);

    },
    testEmailSending:async function(request,response)
    {

        const instance = await phantom.create();
        const page = await instance.createPage();

        await page.open(config.pageUrlToGetImage);
        await page.property('content');

        const filename = Date.now()+'chart.png';
        page.render('./img/'+filename);

        instance.exit();

        response.mailer.render('email', {
            image: 'http://localhost:3000/img/'+filename,
            to: config.mail_client.receiverEmail,
            subject: 'Test Email',
            otherProperty: 'Other Property',
        }, function (err,message) {

            if (err) {
                console.log(err);
                response.send('There was an error sending the email');
                return;
            }
            response.header('Content-Type', 'text/html');
            response.send(message);
        });

    },

    formatDate: function(date)
    {
        var options = {
            hour: 'numeric',
            minute: 'numeric'
        };

         let dateTime = new Date(date);

         return dateTime.toLocaleString('en-US',options)
    },

    cors: function (response){
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Credentials', true);
    }


};

module.exports = ApiController;