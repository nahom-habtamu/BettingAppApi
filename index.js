const express = require('express');
require('./connectToMongo')('BetAppDb');

const users = require('./routes/users');
const bets = require('./routes/bets');
const admins = require('./routes/admins');


const app = express();

// middlewares 
app.use(express.json());
app.use("/upload/profile",express.static('uploads/profilePictures'));



// routes 
app.use('/api/users', users);
app.use('/api/admins', admins);
app.use('/api/bets', bets);




const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('API running on port ' + port);
});