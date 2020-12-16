const mongoose = require('mongoose');
const express = require('express');
const { Bet, betValidationSchema } = require('../models/Bet');
const { User } = require('../models/User');

const checkDate = require('../utility/checkDate');
const Joi = require('joi');
const { adminOrUser, agentAdminOrUser, agentOrUser } = require('../middlewares/role');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/',[auth,agentAdminOrUser], async(req,res) => {
    
    try {
        const bets = await Bet.find({});
        res.status(200).send(bets);
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.get('/:id',[auth, agentAdminOrUser], async(req,res) => {
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


router.delete('/:id',[auth,agentOrUser], async(req,res) => {
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

router.post('/',[auth, agentOrUser],async(req,res) => {
    try {
        const { error } = betValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const data = req.body;
            const { category , deadlineDate , userId , deadlineTime , isResolved } = data;
            const user = await User.findById(userId).select("fullName _id");
            category.user = user;
            if(!user) throw new Error('User not found with given Id');
            if(!checkDate(deadlineDate)) throw new Error('Invalid ' + deadlineDate.calenderType + " date ");
 
            const bet = new Bet({
                createdBy : user,
                category : [ category ],
                users : [],
                isResolved : isResolved,
                deadlineDate : deadlineDate,
                deadlineTime : deadlineTime,
                witness : []
            });

            const result = await bet.save();
            res.status(200).send(result);
            
        }
    } 
    catch (error) {
        res.status(400).send(error.message);    
    }

});

router.post('/addUser',[auth,agentOrUser],async(req,res) => {
    try {
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
            users : [... original.users, user],
            witness : original.witness
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


router.post('/addCategory',[auth,agentOrUser],async(req,res) => {
    try {
        const schema = Joi.object({
            betId : Joi.string().required(),
            category : Joi.object({
                description : Joi.string().required(),
                priceOrMoney : Joi.number().required(),
                userId : Joi.string().required(),
            }).required()
        });

        const { error } = schema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const original = await Bet.findById(req.body.betId);
            if(!original) throw new Error("Bet Not found with given ID");
            const user = await User.findById(req.body.category.userId).select("_id fullName");
            const category = { 
                description : req.body.category.description,
                priceOrMoney : req.body.category.priceOrMoney,
                user : user,
                isMain : false
            }
            const result = await Bet.findByIdAndUpdate(req.body.betId,{
                createdBy : original.createdBy,
                category : [...original.category, category],
                isResolved : original.isResolved,
                deadlineDate : original.deadlineDate,
                deadlineTime : original.deadlineTime,
                users : original.users,
                witness : original.witness,
            }, { new : true});
            
            res.status(200).send(result)
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});


router.post('/addWitness',[auth,agentOrUser], async(req,res) => {
    try {
        const witness = {
            addedBy : await User.findById(req.body.addedBy),
            witnessUser : await User.findById(req.body.witnessUser),
        };

        const original = await Bet.findById(req.body.betId);
        const result = await Bet.findByIdAndUpdate(req.body.betId,{
            createdBy : original.createdBy,
            category : original.category,
            isResolved : original.isResolved,
            deadlineDate : original.deadlineDate,
            deadlineTime : original.deadlineTime,
            users : original.users,
            witness : [...original.witness, witness]
        }, {new : true})

        res.status(200).send(result)
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;