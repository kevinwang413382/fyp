const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const FILEPATH = 'server/1491548723887.json';


var requestData = {
  "classification": false,
  "diff_regression": false,
  "ratio": 0.7,
  "normalize": false,
  "scale": false,
  "continuous_split": true,
  "additional_features": [],
  "time_formats": [],
  "start_test": "14 Jan 2017",
  "end_test": "2 Apr 2017",
  "start_train": "10 Jan 2009",
  "end_train": "14 Jan 2017",
  "features_to_use": ["avg-block-size", "cost-per-transaction","difficulty", "estimated-transaction-volume", "hash-rate", "market-cap", "median-confirmation-time", "miners-revenue", "n-orphaned-blocks","n-transactions-per-block", "market-price"],
  "addit_delimiters": [],
  "model_to_use": "REGRESS_RAND_FOREST"
};



function read(){
  // fs.readFile(FILEPATH, function (err, data) {
  //     console.log(req.body);
  //     if (err) {
  //        return console.error(err);
  //     }
  //     obj = JSON.parse(data);
  //     res.send(data);
  //     console.log("sending file data");
  //  });
}

function write(filepath, body){
  fs.writeFile(filepath, body,  function(err) {
   if (err) {
      return console.error(err);
   }
   console.log("Data written successfully!");

   });
}
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.post('/api', function (req, res) {
  console.log(req.body);
  var options = {
      uri: 'http://113.28.150.73:9100/prepare',
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/json",
      },
      body: JSON.stringify(req.body)
  };
  request(options, function(error, response, body){
    if(error) console.log(error);
    else {
    		console.log(body)
        console.log("Done preparing data, start training!");
    		options['uri'] = 'http://113.28.150.73:9100/train_models';
    		request(options, function(error, response, body){
    			if(error) console.log(error);
    			else{
             console.log("writing and sending response");
             var date = (new Date()).getTime();
             write(date+".json",JSON.toString(body));
             res.set('Content-Type', 'application/json');
             res.send(body);
          }

        });
	     }
    });

});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// });
// var json = {id: "123", rides: [{user: "kevin"},{user:"kevin2"}]};
// var date = new Date();
// var date_string = date.getTime();

// request(options, function(error, response, body){
//     if(error) console.log(error);
//     else {
// 		console.log(body)
// 		options['uri'] = 'http://113.28.150.73:9100/train_models';
// 		request(options, function(error, response, body){
// 			if(error) console.log(error);
// 			else console.log(body);
// 		});
//
// 		requestData['model_to_use'] = 'REGRESS_GBT';
// 		options['body'] = JSON.stringify(requestData);
// 		request(options, function(error, response, body){
// 			if(error) console.log(error);
// 			else{
//         console.log(body);
//         fs.writeFile("server/"+date_string+".txt", JSON.stringify({'param': options, 'body': body}),{ flag: 'w' }, function(err) {
//          if (err) {
//             return console.error(err);
//          }
//          console.log("Data written successfully!");
//         });
//
//       }
// 		});
// 	}
// });
//write(FILEPATH,JSON.stringify(json));
