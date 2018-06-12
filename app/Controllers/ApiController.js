const Waitino = require('./../Models/index').data_waitino_take_aggregate;
const Weka = require('./../Models/index').data_weka_take_aggregate;
const phantom = require('phantom');


const ApiController = {

    index: async function(request,response)
    {
      response.render('index', { title: 'Hey', message: 'Hello there!'});
    },

    getData: async function(request,response)
    {
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
              we: weka[i].value,
              wa: waitino[i].value
          };

          data.push(item);
      }

      response.send(data);

    },
    emailSend:async function(request,response)
    {

            response.mailer.send('index', {
                image: 'http://localhost:3000/img/1528726724492chart.png',
                to: 'avadakkeddavra@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
                subject: 'Test Email', // REQUIRED.
                otherProperty: 'Other Property', // All additional properties are also passed to the template as local variables.
            }, function (err,message) {
                if (err) {
                    // handle error
                    console.log(err);
                    response.send('There was an error sending the email');
                    return;
                }
                response.header('Content-Type', 'text/html');
                response.send(message);
            });

    },

    getPageImage: async function(request,response)
    {

          const instance = await phantom.create();
          const page = await instance.createPage();
          await page.on('onResourceRequested', function(requestData) {
              // console.info('Requesting', requestData.url);
          });

          const status = await page.open('http://localhost:3000/api');
          const content = await page.property('content');

          const dateHash = Date.now();
          page.render('./img/'+dateHash+'chart.png');

          await instance.exit();

          response.send({success:true});

    },

    formatDate: function(date)
    {
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
         let dateTime = new Date(date);

         return dateTime.toLocaleString('en-US',options)
    }


};

module.exports = ApiController;