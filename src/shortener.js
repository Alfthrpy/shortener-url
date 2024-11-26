import express from 'express';
import db from "./db/connection.js";
import shortid from "shortid";
import dotenv from "dotenv";
import Url from './models/Url.js';
dotenv.config();

const router = express.Router();

const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // Protokol (http:// atau https://) opsional
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|localhost|" + // Domain (contoh.com) atau localhost
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // Alamat IP (192.168.0.1)
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // Port opsional dan path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // Query string opsional
    "(\\#[-a-z\\d_]*)?$", // Fragment opsional
    "i"
  );
  


  router.get('/:token', async (req, res) => {
    try {
      const shortUrl = req.params.token;
  
      const url = await Url.findOne({ shortUrl });
  
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
  
      // Increment click count
      url.clicks++;
      await url.save();
  
      // Redirect langsung ke original URL
      res.redirect(301, url.originalUrl); // 301 untuk redirect permanen
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  


// Pastikan POST handler adalah async
router.post('/', async (req, res) => {
    try {
        let { originalUrl } = req.body;

        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = `http://${originalUrl}`;
          }
        // Validate URL
        if (!urlPattern.test(originalUrl)) {
          return res.status(400).json({ error: 'Invalid URL' });
        }
    
        // Check if URL already exists
        let url = await Url.findOne({ originalUrl });
        
        if (url) {
          return res.json({ 
            originalUrl: url.originalUrl, 
            shortUrl: `http://localhost:${process.env.PORT || 3000}/shortener/${url.shortUrl}` 
          });
        }
    
        // Create new short URL
        const shortUrl = shortid.generate();
        
        url = new Url({
          originalUrl,
          shortUrl
        });
    
        await url.save();
    
        res.status(201).json({ 
          originalUrl: url.originalUrl, 
          shortUrl: `http://localhost:${process.env.PORT || 3000}/shortener/${shortUrl}` 
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

export default router;
  