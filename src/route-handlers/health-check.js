const router = require('express').Router();
const responseManager = require('../utils/response-manager');

router.get('/', (req, res) => {
    responseManager.handleSuccess(res, 200);
});

module.exports = router;
