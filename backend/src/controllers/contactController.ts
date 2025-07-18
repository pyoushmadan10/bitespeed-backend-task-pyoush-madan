import { Request, Response } from 'express';
import { identifyContact } from '../services/contactService';

export const handleIdentify = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({
            error: 'Either email or phoneNumber must be provided.',
        });
    }

    try {
        const result = await identifyContact(email, phoneNumber);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in handleIdentify:', error);
        return res.status(500).json({
            error: 'An internal server error occurred.',
        });
    }
};