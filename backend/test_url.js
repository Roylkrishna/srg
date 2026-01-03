const http = require('http');

const url = 'http://localhost:5000/uploads/product-1767437426359-706335350.jpg';

http.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content Type: ${res.headers['content-type']}`);
    console.log(`Content Length: ${res.headers['content-length']}`);
    res.resume();
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
