const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const FILEPATH = 'server/1491548723887.json';
const example_res = {
  metrics: {
    mse: 1,
    mae: 1,
    r2: 1,
    rmse: 1
  },
  graph_data: [
    {
      date: "2017-01-14",
      prediction: 300,
      lable: 300
    },
    {
      date: "2017-01-15",
      prediction: 300,
      lable: 300
    }
  ],
  actual_prediction:[
    {day: 1, prediction: 300},
    {day: 2, prediction: 400},
    {day: 3, prediction: 500}
  ]

};

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

var options = {
    uri: 'http://113.28.150.73:9100/prepare',
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(requestData)
};
// Priority serve any static files.
function write(filepath, body){
  fs.writeFile(filepath, body,  function(err) {
   if (err) {
      return console.error(err);
   }

   console.log("Data written successfully!");
  //  console.log("Let's read newly written data");
  //  fs.readFile('input.txt', function (err, data) {
  //     if (err) {
  //        return console.error(err);
  //     }
  //     console.log("Asynchronous read: " + data.toString());
  //  });
   });
}
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.post('/api', function (req, res) {
  fs.readFile(FILEPATH, function (err, data) {
      console.log(req.body);
      if (err) {
         return console.error(err);
      }
      obj = JSON.parse(data);
      res.send(data);
      console.log("sending file data");
   });
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
  //         write(FILEPATH,JSON.stringify(body));
  //       }
  // 		});
  // 	}
  // });



  // res.set('Content-Type', 'application/json');
  // res.send(example_res);
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
// request.get('http://113.28.150.73:9100/test',function(err,res,body){
//
// if(err) console.log(err);
// else{
//   console.log(body);
// }
// });
var json = {id: "123", rides: [{user: "kevin"},{user:"kevin2"}]};
var date = new Date();
var date_string = date.getTime();

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
