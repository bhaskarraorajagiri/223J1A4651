import express from 'express';
import { createShortUrl, getShortUrlStats, redirectToOriginalUrl } from '../controllers/shortUrl.controller.js';

const router = express.Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectToOriginalUrl);

export default router;
