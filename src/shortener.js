import express from 'express';
import db from "./db/connection.js";
import shortid from "shortid";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get('/:token', async (req, res) => {
    try {
        // Find link in database based on the token
        const link = await db.collection('shortener').findOne({ shorten: req.params.token });

        // If link is found, redirect to the original URL
        if (link) {
            // Ensure the URL has a protocol
            const redirectUrl = link.link.startsWith('http') ? link.link : `https://${link.link}`;
            return res.redirect(redirectUrl);
        } else {
            return res.status(404).json({ error: 'Shortened link not found' });
        }
    } catch (error) {
        console.error('Error fetching link:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Pastikan POST handler adalah async
router.post('/', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({ error: 'Link is required' });
    }

    const newDocument = { link, shorten: shortid.generate() };

    try {
        // Insert document ke database
        const response = await db.collection('shortener').insertOne(newDocument);

        // Pastikan respons berhasil
        if (response.acknowledged) {
            return res.json({ hasil: `${process.env.URL}/shortener/${newDocument.shorten}` });
        } else {
            return res.status(500).json({ error: 'Failed to shorten the link' });
        }
    } catch (error) {
        console.error('Error while inserting to DB:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
