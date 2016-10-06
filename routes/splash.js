var express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.redirect(302, 'http://www.kristinvandeusen.wix.com/elev8');
});

module.exports = router;