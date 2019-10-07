var http = new XMLHttpRequest();
var url = 'https://api.ocr.space/parse/image';
var params = 'filetype=JPG&url=https://scontent-otp1-1.xx.fbcdn.net/v/t1.0-0/p480x480/71252870_2037787872991296_7811325702057230336_n.jpg?_nc_cat=106&_nc_oc=AQmxyrc7RIsCULe-LURIH1irUEy9wqq92swSeHitla9tHru6-bzAuWA1NdnEUiprFLU&_nc_ht=scontent-otp1-1.xx&oh=573cc79b63fffcf9984a42e653fa92c8&oe=5E21846E';
//to do here
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
http.setRequestHeader('apikey', '642fae218f88957');
var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\neng\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"isOverlayRequired\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\nhttps://scontent-otp1-1.xx.fbcdn.net/v/t1.0-0/p480x480/71252870_2037787872991296_7811325702057230336_n.jpg?_nc_cat=106&_nc_oc=AQmxyrc7RIsCULe-LURIH1irUEy9wqq92swSeHitla9tHru6-bzAuWA1NdnEUiprFLU&_nc_ht=scontent-otp1-1.xx&oh=573cc79b63fffcf9984a42e653fa92c8&oe=5E21846E\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"iscreatesearchablepdf\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"issearchablepdfhidetextlayer\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";


http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(postData);

/*

var form = new FormData();
form.append("language", "eng");
form.append("isOverlayRequired", "false");
form.append("url", "https://scontent-otp1-1.xx.fbcdn.net/v/t1.0-0/p480x480/71252870_2037787872991296_7811325702057230336_n.jpg?_nc_cat=106&_nc_oc=AQmxyrc7RIsCULe-LURIH1irUEy9wqq92swSeHitla9tHru6-bzAuWA1NdnEUiprFLU&_nc_ht=scontent-otp1-1.xx&oh=573cc79b63fffcf9984a42e653fa92c8&oe=5E21846E");
form.append("iscreatesearchablepdf", "false");
form.append("issearchablepdfhidetextlayer", "false");

var settings = {
  "url": "https://api.ocr.space/parse/image",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "apikey": "642fae218f88957"
  },
  "processData": false,
  "mimeType": "multipart/form-data",
  "contentType": false,
  "data": form
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
*/


var https = require('https');

var options = {
  'method': 'POST',
  'hostname': 'api.ocr.space',
  'path': '/parse/image',
  'headers': {
    'apikey': 'helloworld'
  }
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\neng\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"isOverlayRequired\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\nhttp://dl.a9t9.com/ocrbenchmark/eng.png\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"iscreatesearchablepdf\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"issearchablepdfhidetextlayer\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

req.write(postData);

req.end();