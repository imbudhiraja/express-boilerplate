const express = require('express');
const fileRoutes = require('./files/routes');
const userRoutes = require('./user/routes');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
router.use('/files', fileRoutes);
router.use('/user', userRoutes);

module.exports = router;
