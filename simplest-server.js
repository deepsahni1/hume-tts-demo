const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World! Server is working.\n');
});

const PORT = 9000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
}); 