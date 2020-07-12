const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const pingmydyno = require('pingmydyno');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
const cors = require('cors');
const port = process.env.PORT || 3000;
app.use(cors());


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// middleware for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // goes to next route
});

router.get('/', (req, res) => {
    res.json({message: 'Welcome to the Library.'});
});


app.use('/', router);

// other routes
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const bookRoutes = require('./routes/book')
app.use('/admin', adminRoutes);
app.use('/', userRoutes);
app.use('/', bookRoutes)



app.listen(port, () => {
    console.log(`Listening on Port ${port}...`);
    pingmydyno('https://library-management-api-project.herokuapp.com/');
    })