import express from 'express';
import { identifyContact } from '../services/contactService';
import { IdentifyRequest } from '../types';

const router = express.Router();

// Using a basic JavaScript approach without complex TypeScript annotations
router.post('/identify', function(req, res) {
  // Wrap the async functionality in a self-invoking async function
  (async function() {
    try {
      const { email, phoneNumber } = req.body;
      
      if (!email && !phoneNumber) {
        res.status(400).json({ error: 'At least one of email or phoneNumber is required' });
        return;
      }
      
      const response = await identifyContact({ 
        email: email || null, 
        phoneNumber: phoneNumber || null 
      });
      
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })();
});

export default router;