const express = require('express');
const upload = require('../utils/multerconfig');

const router = express.Router();

// Upload endpoint
router.post('/api/files/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

module.exports = router;
