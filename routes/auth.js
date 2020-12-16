const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../models/User');
const { Admin } = require('../models/Admin');

router.post('/', async(req,res) => {
    try {
        const { error } = authRequestValidate.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            let isUserOrAdmin = ""
            const user = await User.findOne({ email : req.body.email});
            const admin = await Admin.findOne({ email : req.body.email});
            if(user && !admin) {
                isUserOrAdmin = "user";
            }
            else if(!user && admin){
                isUserOrAdmin = "admin";
            }
            else {
                throw new Error('Incorrect Email Address');
            }
            if(isUserOrAdmin === "user"){
                const checkedPassword = await bcrypt.compare(req.body.password, user.password);
                if(!checkedPassword){
                    throw new Error('Incorrect Password');
                }
                const token = user.generateAuthToken();
                res.send(token);
            }
            else if(isUserOrAdmin === "admin"){
                const checkedPassword = await bcrypt.compare(req.body.password, admin.password);
                if(!checkedPassword){
                    throw new Error('Incorrect Password');
                }
                const token = admin.generateAuthToken();
                res.send(token);
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

const authRequestValidate = Joi.object({
    email : Joi.string().min(10).max(100),
    password : Joi.string().min(8).max(255)
});


module.exports = router;