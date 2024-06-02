const express = require('express');
const bodyParser = require('body-parser');

const {
    MusicDesc
} = require('./models');

const galleryRoutes = express.Router();

galleryRoutes.get('/', async (req, res) => {
    console.log('Handling GET /gallery');
    
    const searchInput = req.query.search;
    console.log('searchInput:', searchInput);

    if (searchInput) {
        try{
            const regex = new RegExp(searchInput, 'i'); // 'i' makes the search case-insensitive
            const musicDescs = await MusicDesc.find({ fileName: { $regex: regex } });
            console.log('Finding all searched music:', musicDescs);
            res.status(200).json({ musicDescs: musicDescs });
        } catch (error) {
            console.error('Error Finding all music desc:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        try{
            const musicDescs = await MusicDesc.find();
            console.log('Finding all music:', musicDescs);
            res.status(200).json({ musicDescs: musicDescs });
        } catch (error) {
            console.error('Error Finding all music desc:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = {
    galleryRoutes
};
