const express = require('express');
const router = express.Router();
const Bank = require('../models/bank.model');
let authenticate = require("../service/auth").authenticateToken;
// Create bank details
router.post('/bank-details', authenticate, async (req, res) => {
  try {
    const {  name, accountNumber, ifscCode, bankName, accountType } = req.body;

    // Check for existing account number
    userId = req.user.id;
    if(name == null || accountNumber == null || ifscCode == null || bankName == null || accountType == null){
        return res.status(400).json({ message: 'All fields are required' });
    }
    const existingAccount = await Bank.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    // Create and save new bank details
    const bankDetails = new Bank({
      userId,
      name,
      accountNumber,
      ifscCode,
      bankName,
      accountType,
    });

    await bankDetails.save();
    res.status(201).json({ message: 'Bank details added successfully', bankDetails });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'An error occurred while adding bank details' });
  }
});


// Fetch bank details by userId
router.get('/bank-details',authenticate, async (req, res) => {
    try {
      // const { userId } = req.params;
      let userId = req.user.id;
      const bankDetails = await Bank.find({ userId });
      if (!bankDetails || bankDetails.length === 0) {
        return res.status(404).json({ message: 'No bank details found for this user' });
      }
  
      res.status(200).json({ message: 'Bank details fetched successfully', bankDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching bank details' });
    }
  });

router.delete('/bank-details',authenticate, async (req, res) => {
    try {
      const  userId  = req.user.id;
  
      // Find and delete the bank details
      const deletedBankDetails = await Bank.findOneAndDelete({  userId });
      if (!deletedBankDetails) {
        return res.status(404).json({ message: 'Bank details not found' });
      }
  
      res.status(200).json({ message: 'Bank details deleted successfully', deletedBankDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while deleting bank details' });
    }
  });
  
  module.exports = router;

