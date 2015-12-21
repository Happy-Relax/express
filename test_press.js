//var http = require('http');             // 引入 http 模組
//var express = require('express');       // 引入 express 模組
//var app = express();                    // 建立 express 物件
//var server = http.createServer(app);    // 建立 http 物件
//
//// 處理 / (根目錄) 的 URL GET 要求
//app.get('/',function(request, response){
//    response.end('hi!this is the / ');
//});
//
//// 處理 /test 的 URL GET 要求
//app.get('/test',function(request, response){
//    response.end('hi!this is test.');
//});
//
//// 啟動 http 伺服器服務於位址 127.0.0.1 阜號 8080
//server.listen(8080,'127.0.0.1',function(){
//    console.log('HTTP Server: http://127.0.0.1:8080/');
//});
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//app.get('/', function (req, res) {
//  res.send('Hello World!');
//});
//npm install redis
//connect redis
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

var alls=JSON.stringify([
                      {
                        "barcode":"ITEM000000",
                        "name": "可口可乐",
                        "unit": "瓶",
                        "price": 3.00
                      },
                      {
                        "barcode":"ITEM000001",
                        "name": "雪碧",
                        "unit": "瓶",
                        "price": 3.00
                      },
                      {
                        "barcode": "ITEM000002",
                        "name": "苹果",
                        "unit": "斤",
                        "price": 5.50
                      },
                      {
                        "barcode": "ITEM000003",
                        "name": "荔枝",
                        "unit": "斤",
                        "price": 15.00
                      },
                      {
                        "barcode":"ITEM000004",
                        "name": "电池",
                        "unit": "个",
                        "price": 2.00
                      },
                      {
                        "barcode": "ITEM000005",
                        "name": "方便面",
                        "unit": "袋",
                        "price": 4.50
                      }
                    ]);

var loads=JSON.stringify([
                       {
                         "type": "BUY_TWO_GET_ONE_FREE",
                         "barcodes": [
                           "ITEM000000",
                           "ITEM000001",
                           "ITEM000005"
                         ]
                       }
                     ]);


client.set('alls', alls);
client.set('loads', loads);
//client.get('alls', function(err, reply) {
//    console.log(reply);
//});


var http = require('http');

//The url we want is: 'http://localhost:8080/base/helloworld'
var options = {
  host: 'http://localhost:8080',
  path: '/base/helloworld'
};

//callback = function(response) {
//  var str = '';
//
//  //another chunk of data has been recieved, so append it to `str`
//  response.on('data', function (chunk) {
//    str += chunk;
//  });
//
//  //the whole response has been recieved, so we just print it out here
//  response.on('end', function () {
//    console.log(str);
//  });
//}
//
//http.request(options, callback).end();


//app.get('/all', function (req, res) {
//  res.send([
//             {
//               "barcode":"ITEM000000",
//               "name": "可口可乐",
//               "unit": "瓶",
//               "price": 3.00
//             },
//             {
//               "barcode":"ITEM000001",
//               "name": "雪碧",
//               "unit": "瓶",
//               "price": 3.00
//             },
//             {
//               "barcode": "ITEM000002",
//               "name": "苹果",
//               "unit": "斤",
//               "price": 5.50
//             },
//             {
//               "barcode": "ITEM000003",
//               "name": "荔枝",
//               "unit": "斤",
//               "price": 15.00
//             },
//             {
//               "barcode":"ITEM000004",
//               "name": "电池",
//               "unit": "个",
//               "price": 2.00
//             },
//             {
//               "barcode": "ITEM000005",
//               "name": "方便面",
//               "unit": "袋",
//               "price": 4.50
//             }
//           ]);
//});

app.get('/load', function (req, res) {

client.get('loads', function(err, reply) {

                  res.send(JSON.parse(reply));
              })

});

app.get('/all', function (req, res) {
        client.get('alls', function(err, reply) {

                    res.send(JSON.parse(reply)
              )});
});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/inputs',function (req,res,next) {
//        console.log(req.body.inputs);
        client.del('inputs');
        client.set('inputs_express',JSON.stringify(req.body.inputs));
});

app.get('/inputs', function (req, res) {
        client.get('inputs_express', function(err, reply) {
//                    console.log(JSON.parse(reply));
                    res.send(JSON.parse(reply))
                    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

