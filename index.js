const express = require('express');
require('./connectToMongo')('BetAppDb');

const users = require('./routes/users');
const bets = require('./routes/bets');
const admins = require('./routes/admins');
const auth = require('./routes/auth');


const app = express();

// middlewares 
app.use(express.json());
app.use("/upload/profile",express.static('uploads/profilePictures'));
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
    next();
});


// routes 
app.use('/api/users', users);
app.use('/api/admins', admins);
app.use('/api/bets', bets);
app.use('/api/auth', auth);




const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('API running on port ' + port);
});