const express = require('express');
const mongoose = require('mongoose');
const { Notification , notificationValidationSchema } = require('../models/Notification');
const auth = require('./auth');
const { agentAdminOrUser, agentOrUser } = require('../middlewares/role');
const router = express.Router();

router.get('/',[auth, agentAdminOrUser],async(req,res) => {
    try {
        const notifications = await Notification.find({});
        res.status(200).send(notifications);
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.get('/:id',[auth,agentAdminOrUser],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid){
            const notification = await Notification.findById(id);
            if(notification){
                res.status(200).send(notification);
            }
            else {
                throw new Error('Notification not found with given ID');
            }
        }
        else {
            throw new Error('Invalid Notification Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.delete('/:id',[auth, agentOrUser ],async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid){
            const deletedNotification = await Notification.findByIdAndDelete(id);
            if(deletedNotification){
                res.status(200).send(deletedNotification);
            }
            else {
                throw new Error('Notification not found with given ID');
            }
        }
        else {
            throw new Error('Invalid Notification Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.post('/',[auth, agentOrUser],async(req,res) => {
    try {
        const { error } = notificationValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const notification = new Notification(
                ...req.body
            );
            const result = await notification.save();
            res.status(200).send(result);
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.put('/:id',[auth,agentOrUser],async(req,res) => {
    try {
        const { error } = notificationValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id)){

                const editedNotification = await Notification.findByIdAndUpdate(id,
                    ...req.body,
                    { new : true}
                );
                res.status(200).send(editedNotification);
            }
            else {
                throw new Error('Invalid Notification Identifier');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});


module.exports = router;