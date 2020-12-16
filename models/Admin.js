const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({

    fullName : {
        type : String,
        required : [ true, "Enter Full Name"],
        maxlength : 50,
        minlength : 3
    },

    phoneNumber : {
        unique : true,
        type : String,
        maxlength : 13,
        minlength : 10,
        required : [true, "Enter Your Phone Number"],
        validate : {
            validator : (pn) => {
                const pnRegexFull = /^[+][2][5][1][9][0-9]/;
                const pnRegexSmall = /^[0][9][0-9]/;
                if(pn.length === 13){
                    return pnRegexFull.test(pn);
                }
                else if(pn.length === 10){
                    return pnRegexSmall.test(pn);
                }
                else {
                    return false;
                }
            },
            error : "Invalid Phone Number"
        }
    },

    email : {
        unique : true,
        type : String,
        maxlength : 100,
        minlength : 10,
        required : [ true, "email is required"],
        validate : {
            validator : (email) => {
                const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                return regex.test(email);
            },
            message : "Email is not valid"
        }
    },

    password : {
        type : String,
        minlength : 8,
        maxlength : 255,
        required : [true , "password is required"]
    },

   permissions : {
       type : [ String ],
       required : [true, " Even if it is an empty array"]
   },

   role : {
       type : String,
       default : "admin"
   }

});

adminSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id : this._id ,role : this.role, permissions : this.permissions },"somejwtkey");
    return token;
}


const Admin = mongoose.model('Admins', adminSchema);
const adminValidationSchema = Joi.object({
    fullName : Joi.string().required().max(100),
    email : Joi.string().required().max(100),
    phoneNumber : Joi.string().required().min(10).max(13),
    password : Joi.string().required().min(8).max(255),
    permissions : Joi.array().required().min(0)
});

module.exports.Admin = Admin;
module.exports.adminValidationSchema = adminValidationSchema;



