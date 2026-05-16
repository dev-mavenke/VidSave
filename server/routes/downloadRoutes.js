const express = require('express');
const router = express.Router();
const { getMetadata, downloadVideo } = require('../controllers/downloadController');

router.get('/info', getMetadata);
router.get('/download', downloadVideo);

module.exports = router;
