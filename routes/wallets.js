const express = require('express');
const mongoose = require('mongoose');
const { Wallet , walletValidationSchema } = require('../models/Wallet');

const router = express.Router();

router.get('/', async(req,res) => {
    try {
        const wallets = await Wallet.find({});
        res.status(200).send(wallets);
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.get('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid){
            const wallet = await Wallet.findById(id);
            if(wallet){
                res.status(200).send(wallet);
            }
            else {
                throw new Error('Wallet not found with given ID');
            }
        }
        else {
            throw new Error('Invalid Wallet Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        if(mongoose.Types.ObjectId.isValid){
            const deletedWallet = await Wallet.findByIdAndDelete(id);
            if(deletedWallet){
                res.status(200).send(deletedWallet);
            }
            else {
                throw new Error('Wallet not found with given ID');
            }
        }
        else {
            throw new Error('Invalid Wallet Identifier');
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.post('/', async(req,res) => {
    try {
        const { error } = walletValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const wallet = new Wallet(
                ...req.body
            );
            const result = await wallet.save();
            res.status(200).send(result);
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});

router.put('/:id', async(req,res) => {
    try {
        const { error } = walletValidationSchema.validate(req.body);
        if(error){
            throw error;
        }
        else {
            const id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(id)){

                const editedWallet = await Wallet.findByIdAndUpdate(id,
                    ...req.body,
                    { new : true}
                );
                res.status(200).send(editedWallet);
            }
            else {
                throw new Error('Invalid Wallet Identifier');
            }
        }
    } 
    catch (error) {
        res.status(400).send(error.message)    
    }
});


module.exports = router;