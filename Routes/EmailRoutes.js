const express = require('express');
const router = express.Router();
const { sendEmailController } = require('../Controllers/EmailController');

router.post('/send-email', sendEmailController);

module.exports = router;
