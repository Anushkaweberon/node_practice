const http = require('http');

// const server = http.createServer((req, res) => {
//     if(req.url === '/'){
//         res.end('This is my Home Page');
//     } else if(req.url === '/about'){
//         res.end('This is my About Page');
//     } else if(req.url === '/contact'){
//         res.end('This is my Contact Page');
//     } else {
//         res.end('404, Resource Not Found');
//     }
// })


const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>Home Page</h1>');
        res.end();
    } else if(req.url === '/about'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>About Page</h1>');
        res.end();
    } else if(req.url === '/contact'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<h1>Contact Page</h1>');
        res.end();
    } else {
        res.writeHead(404, {'content-type': 'text/html'});
        res.write('<h1>404, Resource Not Found <a href="/">Go Back Home</a></h1>');
        res.end();
    }
})

server.listen(5000, () => {
    console.log('Server listening at port 5000');
  }).on('error', (err) => {
    console.error('Error starting server:', err);
  });
  