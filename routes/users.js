const express = require('express');
const { User , userValidationSchema } = require('../models/User');
const mongoose = require('mongoose');
const upload = require('../multer/multerProfilePictureConfig');
const router = express.Router();
const fs = require('fs');

router.get('/', async(req,res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users);
    } 
    catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/:id', async(req,res) => {
    
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const user = await User.findById(id);
            if(user)
                res.status(200).send(user);
            else 
                throw new Error('User Not Found With Given Id')
        }
        else {
            throw new Error('Invalid User Id')
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
            const deleted = await User.findByIdAndDelete(id);
            if(deleted)
                res.status(200).send(deleted);
            else 
                throw new Error('User Not Found With Given Id');
        }   
        else {
            throw new Error('Invalid User Id');
        } 
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.post('/', upload.single('profile'), async(req,res) => {
    
    try {
        const { error } = userValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.details[0].message)
        }
        else {
            if(req.file){
                const user = new User({
                    fullName : req.body.fullName,
                    phoneNumber : req.body.phoneNumber,
                    email : req.body.email,
                    password : req.body.password,
                    profile : req.file.path
                });
                const result = await user.save();
                res.status(201).send(result);
            }
            else {
                throw new Error('Profile Pic Not Found')
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }

});

router.put('/:id', upload.single('profile'),async(req,res) => {
    
    try {
        const { error } = userValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.details[0].message)
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id)){
                const original = await User.findById(id);
                if(!original)
                    throw new Error('User With Given Id Not Found');
                if(req.file){
                    fs.unlink(original.profile, (err) => {
                        if(err)
                            throw err;
                        else {
                            console.log('File Deleted Succesfully');
                        }
                    });
                    const userWithPp = await User.findByIdAndUpdate(id, {
                        fullName : req.body.fullName,
                        phoneNumber : req.body.phoneNumber,
                        email : req.body.email,
                        password : req.body.password,
                        profile : req.file.path
                    }, { new : true});

                    res.status(200).send(userWithPp);
                }
                else {
                    const userWithOutPp = await User.findByIdAndUpdate(id, {
                        fullName : req.body.fullName,
                        phoneNumber : req.body.phoneNumber,
                        email : req.body.email,
                        password : req.body.password,
                        profile : original.profile
                    }, { new : true});

                    res.status(200).send(userWithOutPp);
                }
            }
            else {
                throw new Error('Invalid Object Id');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});


module.exports = router;