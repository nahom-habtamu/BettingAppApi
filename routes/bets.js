const mongoose = require('mongoose');
const express = require('express');
const { Bet, betValidationSchema } = require('../models/Bet');
const { User } = require('../models/User');

const checkDate = require('../utility/checkDate');


const router = express.Router();

router.get('/', async(req,res) => {
    
    try {
        const bets = await Bet.find({});
        res.status(200).send(bets);
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.get('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid(id)){
            const bet = await Bet.findById(id);
            if(bet){
                res.status(200).send(bet);
            }
            else {
                throw new Error('Bet not found with given Id');
            }
        }
        else {
            throw new Error('Invalid Bet Identifier')
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
            const deleted = await Bet.findByIdAndDelete(id);
            if(deleted)
                res.status(200).send(deleted);
            else 
                throw new Error('Bet is not found with given Id');
        }
        else {
            throw new Error('Invalid Bet Identifier')
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }
});

router.post('/', async(req,res) => {
    try {
        const { error } = betValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const data = req.body;
            const { category , deadlineDate , userId , deadlineTime , isResolved } = data;
            const user = await User.findById(userId).select("fullName _id");

            if(!user) throw new Error('User not found with given Id');
            if(!checkDate(deadlineDate)) throw new Error('Invalid ' + deadlineDate.calenderType + " date ");
 
            const bet = new Bet({
                createdBy : user,
                category : [ category ],
                users : [],
                isResolved : isResolved,
                deadlineDate : deadlineDate,
                deadlineTime : deadlineTime
            });

            const result = await bet.save();
            res.status(200).send(result);
            
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }

});

router.post('/addUser', async(req,res) => {
    try {
        if(mongoose.Types.ObjectId.isValid(req.body.betId) && mongoose.Types.ObjectId.isValid(req.body.userId)){
            throw new Error('Invalid Identifier for Bet or User');
        }
        const original = await Bet.findById(req.body.betId);
        if(original.createdBy._id === req.body.userId){
            throw new Error('Creator cant be assigned as a user of a bet');
        }
        const user = await User.findById(req.body.userId).select("fullName _id");
        if(!user){
            throw new Error('user not found with given Id')
        }
        const result = await Bet.findByIdAndUpdate(req.body.betId,{
            createdBy : original.createdBy,
            category : original.category,
            isResolved : original.isResolved,
            deadlineDate : original.deadlineDate,
            deadlineTime : original.deadlineTime,
            users : [... original.users, user]
        }, { new : true});

        if(!result){
            throw new Error('bet not found with given Id')
        }
        else {
            res.status(200).send(result);
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router;