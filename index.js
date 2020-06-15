const express = require('express');
const app = express();
const User = require('/models/user');

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

//app.get('/api/login')

app.listen(port, (error) => {
    console.log(`Listening on Port ${port}...`)
    })