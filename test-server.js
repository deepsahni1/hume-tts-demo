const express = require('express');
const path = require('path');

const app = express();
const PORT = 8888;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${PORT}`);
}); 