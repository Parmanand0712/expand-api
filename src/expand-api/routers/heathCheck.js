const express = require('express');

const router = express.Router();
const {getServerHealth} = require('../controllers/healthCheck');

router.get('/',getServerHealth);

module.exports = router;
