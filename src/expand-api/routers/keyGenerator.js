const express = require('express');

const router = express.Router();
const { generateKey, addPlanForKey, deleteAPIKey,
    getAPIKey, updateAPIKey, getTotalComputeUnits
} = require('../controllers/keyGenerator');

router.post('/key/generate', generateKey);
router.post('/key/assignplan', addPlanForKey);
router.post('/key/delete', deleteAPIKey);
router.post('/key/get', getAPIKey);
router.post('/key/update', updateAPIKey);
router.get('/key/usage-details/:apiKey', getTotalComputeUnits);

module.exports = router;
