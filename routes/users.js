const fs = require('fs');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');

const { User , userValidationSchema } = require('../models/User');
const upload = require('../multer/multerProfilePictureConfig');
const auth = require('../middlewares/auth');
const { admin, adminOrUser,agentAdminOrUser, agentOrUser, agent , user} = require('../middlewares/role');

const router = express.Router();

router.get('/', [auth,agentAdminOrUser], async(req,res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users);
    } 
    catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/:id',[auth, agentAdminOrUser] ,async(req,res) => {
    
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

router.delete('/:id',[auth,agentAdminOrUser],async(req,res) => {

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

router.post('/', async(req,res) => {
    
    try {
        const { error } = userValidationSchema.validate(req.body);
        if(error){
            throw new Error(error.details[0].message)
        }
        else {
            const salt = await bcrypt.genSalt(10);  
            const hashedPassword = await bcrypt.hash(req.body.password,salt);  
            const user = new User({
                fullName : req.body.fullName,
                email : req.body.email,
                password : hashedPassword,
                role : req.body.role
            });
            await user.save();
            const hiddenPassword = await User.findById(user._id).select("_id role email fullName");          
            const token = user.generateAuthToken();
            res.header('x-auth-token',token).send(hiddenPassword);
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }

});

router.post('/addProfilePic/:id',[auth,agentOrUser], upload.single('profile'), async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const user = await User.findById(id);
            if(user){
                if(req.file){
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
                    throw new Error('Picture To Upload Is Not Found');
                }
            }
            else {
                throw new Error('User not found with given ID')
            }
        }
        else {
            throw new Error('Invalid User Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.post('/addPhone/:id',[auth, agentOrUser], upload.single('profile'), async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const user = await User.findById(id);
            if(user){
                if(!user.phoneNumber){
                    const userWithPp = await User.findByIdAndUpdate(id, {
                        fullName : user.fullName,
                        phoneNumber : req.body.phoneNumber,
                        email : user.email,
                        password : user.password,
                        profile : user.profile
                    }, { new : true});

                    res.status(200).send(userWithPp);
                }
                else {
                    throw new Error('User Already Has A phone Number');
                }
            }
            else {
                throw new Error('User not found with given ID')
            }
        }
        else {
            throw new Error('Invalid User Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});




router.put('/:id', [auth,agentOrUser], upload.single('profile'),async(req,res) => {
    
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