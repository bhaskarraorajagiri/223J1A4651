import ShortUrl from '../models/url.model.js';
import { nanoid } from 'nanoid';

export const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const code = shortcode || nanoid(6);
  const expiryDate = new Date(Date.now() + validity * 60000); 

  try {
    const exists = await ShortUrl.findOne({ shortCode: code });

    if (exists && !shortcode) {
      return res.status(409).json({ error: 'Generated shortcode already exists' });
    }

    if (shortcode && exists) {
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const newShort = new ShortUrl({
      originalUrl: url,
      shortCode: code,
      expiry: expiryDate,
    });

    await newShort.save();

    res.status(201).json({
      shortLink: `http://${req.headers.host}/${code}`,
      expiry: expiryDate.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortCode: shortcode });

    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      visitCount: shortUrl.visitCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const shortUrl = await ShortUrl.findOne({ shortCode: shortcode });

    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    if (shortUrl.expiry && new Date() > shortUrl.expiry) {
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    shortUrl.visitCount += 1;
    await shortUrl.save();

    res.redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
