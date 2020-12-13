const mongoose = require('mongoose');
const express = require('express');
const { Admin, adminValidationSchema } = require('../models/Admin');
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
            const admin = new Admin({
                fullName : req.body.fullName,
                email : req.body.email,
                phoneNumber : req.body.phoneNumber,
                password : req.body.password,
                permissions : req.body.permissions
            });

            const result = await admin.save();
            res.status(200).send(result);
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
            const edited = await Admin.findByIdAndUpdate(id, {
                fullName : req.body.fullName,
                email : req.body.email,
                phoneNumber : req.body.phoneNumber,
                password : req.body.password,
                permissions : req.body.permissions

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