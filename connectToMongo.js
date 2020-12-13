const mongoose = require('mongoose');
module.exports = async function(dbName){
    try {
        await mongoose.connect(`mongodb://localhost/${dbName}`, {
            useFindAndModify : false,
            useNewUrlParser : true,
            useCreateIndex : false,
            useUnifiedTopology : true,
            useCreateIndex : true
        });
        console.log("Connected To { " + dbName + " } database succesfully"); 
    } 
    catch (error) {
        console.log(error.message);
    }
};