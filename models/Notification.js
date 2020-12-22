const mongoose = require('mongoose');
const Joi = require('joi');

const notificationSchema = new mongoose.Schema({
    header  : {
        type : String,
        required : [true, "ofcourse you need a header for the notification "],
        maxlength : 50
    },

    description : {
        type : String,
        required : [true, "sorry but i need it for the front end"],
        maxlength : 150
    },

    date : {
        type : Date ,
        required : [true, "It is needed for sorting purposes"],
        maxlength : 50
    },

    type : {
        type : String,
        required : [true, "It is used for reusablity and front end"]
    }

});


const Notification = mongoose.model("Notifications", notificationSchema);
const notificationValidationSchema = Joi.object({
    header : Joi.string().required().max(50),
    description : Joi.string().required().max(100),
    date : Joi.date().required(),
    type : Joi.string().required()
});


module.exports.Notification = Notification;
module.exports.notificationValidationSchema = notificationValidationSchema;