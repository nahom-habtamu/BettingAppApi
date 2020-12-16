const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { Admin, adminValidationSchema } = require('../models/Admin');
const auth = require('../middlewares/auth');
// const { } = require('../middlewares/role'); // There should be a superAdmin

const router = express.Router();

router.get('/', async(req,res) => {
    
    try {
        const admins = await Admin.find({});
        res.status(200).send(admins);
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', async(req,res) => {
    
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const admin = await Admin.findById(id);
            if(admin){
                res.status(200).send(admin);
            }
            else {
                throw new Error('Admin Not Found');
            }
        }
        else {
            throw new Error('Invalid Admin Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }

});

router.delete('/:id', async(req,res) => {
    
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const deleted = await Admin.findByIdAndDelete(id);
            if(deleted)
                res.status(200).send(deleted);
            else 
                throw new Error('Admin not found');
        }
        else {
            throw new Error('Invalid Id');
        }   
    } 
    catch (error) {
        res.status(400).send(error.message);
    }

});

router.post('/', async(req,res) => {
    
    try {
        const { error } = adminValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const salt = await bcrypt.genSalt(10);  
            const hashedPassword = await bcrypt.hash(req.body.password,salt);  

            const admin = new Admin({
                fullName : req.body.fullName,
                email : req.body.email,
                phoneNumber : req.body.phoneNumber,
                password : hashedPassword,
                role : "admin",
                permissions : req.body.permissions
            });

            await admin.save();
            const hiddenPassword = await Admin.findById(admin._id).select("_id role phoneNumber permissions email fullName");          
            const token = admin.generateAuthToken();
            req.setHeader('x-auth-token',token);
            res.send(hiddenPassword);
        }
    } 
    catch (error) {
        res.status(400).send(error.message);   
    }
});

router.put('/:id', async(req,res) => {
    try {
        const id = req.params.id;

        if(mongoose.Types.ObjectId.isValid(id)){
            const salt = await bcrypt.genSalt(10);  
            const hashedPassword = await bcrypt.hash(req.body.password,salt);  

            const edited = await Admin.findByIdAndUpdate(id, {
                fullName : req.body.fullName,
                email : req.body.email,
                phoneNumber : req.body.phoneNumber,
                password : hashedPassword,
                permissions : req.body.permissions,
                role : "admin"
            }, { new : true });

            if(edited){
                res.status(200).send(edited);
            }
            else {
                throw new Error('Admin not found with given Id')
            }
        }
        else {
            throw new Error('Invalid Admin Id');
        }
    } 
    catch (error) {
        res.status(400).send(error.message);      
    }
});

module.exports = router;