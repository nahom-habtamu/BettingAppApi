const Joi = require('joi');
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user : {
        type : new mongoose.Schema({
            fullName : {
                type : String,
                required : [ true, "Enter Full Name"],
                maxlength : 50,
                minlength : 3
            }
        }),

        required : [true, "What are you thinking a wallet with out a user oh"]
    },

    serviceType : {
        type : String,
        required : [true, "I swear i don't know what it is for "]
    },

    amount : {
        type : Number,
        min : 0,
        required : [true, "Even if it is zero"]
    },

});

const Wallet = mongoose.model('Wallets', walletSchema);

const walletValidationSchema = Joi.object({
    userId : Joi.objectId().required(),
    serviceType : Joi.string().required(),
    amount : Joi.number().required().min(0)
});

module.exports.Wallet = Wallet;
module.exports.walletValidationSchema = walletValidationSchema;