const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Node.js running on MicroK8s with Jenkins, Kaniko, Helm, and ArgoCD!');
});

app.listen(3000, () => {
  console.log('Node.js app running on port 3000');
});
