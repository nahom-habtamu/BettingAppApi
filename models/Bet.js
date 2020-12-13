const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const { userSchema } = require('./User'); 

const betSchema = new mongoose.Schema({
    createdBy : {
        type : new mongoose.Schema({
            fullName : String,
            userID : mongoose.Types.ObjectId
        }),
        required : [true, "Ofcourse a bet cannot be created with out a user"]
    },

    category : {
        type : [new mongoose.Schema({
            description : {
                type : String,
                required : [true, "A description is required for any bet category"]
            },
            isMain : {
                type : Boolean, default : true,
                required : [true, "checking out if the description is main or not is important"]
            },

            priceOrMoney : {
                type : Number,
                required : [ true , "this isn't elementary right ?"]
            }
        })]
    },

    users : {
        type : [ userSchema ],
        required : [true, "hmmmmmmmmm let's get away with this"],
        default : []
    },
    witness : {
        type : [ new mongoose.Schema({
                addedBy : {
                    type : userSchema,
                    required : [true, "if no adder no witness right"]
                },

                witnessUser : {
                    type : userSchema,
                    required : [true, "the witness itself is required"]
                } 
            })
        ]
    },

    isResolved : {
        type : Boolean,
        required : [true , "Yeah because at the end we need it to kick its ass"]
    },

    deadlineDate : {
        type : new mongoose.Schema({
            day : {
                type : Number, required : true,
                min : 1, max : 31
            },
            month : {
                type : Number, required : true,
                min : 1, max : 13
            },

            year : {
                type : Number, required : true,
            },

            calanderType : {
                type : String, required : true,
                validate : {
                    validator : (thing) => {
                        if(thing.trim() === "GC" || thing.trim() === "EC"){
                            return true;
                        }

                        return false;
                    }
                }
            }

        }),

    },

    deadlineTime : {
        type : new mongoose.Schema({

            hour : {
                type : Number,
                required : true, max : 23, min : 0
            },

            minute : {
                type : Number, required : true,
                max : 59, min : 0
            }
        })
    }
});

const Bet = mongoose.model('Bets', betSchema);

const betValidationSchema = Joi.object({
    userId : Joi.ObjectId().required(),
    category : Joi.object({
        description : Joi.string().required(),
        priceOrMoney : Joi.number().required().min(1)
    }),
    isResolved : Joi.boolean().default(false).required(),
    deadlineDate : Joi.object({
        month : Joi.number().min(1).max(13).required(),
        day : Joi.number().min(1).max(31).required(),
        year : Joi.number().required(),
        calanderType : Joi.string().required().min(2).max(2)
    }),
    deadlineTime : Joi.object({
        hour : Joi.number().required().max(23).min(0),
        minute : Joi.number().required().max(59).min(0),
    }),
});


module.exports.Bet = Bet;
module.exports.betValidationSchema = betValidationSchema;
