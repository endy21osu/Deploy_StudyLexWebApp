var express = require('express'),
    router = express.Router(),
    http = require('http');

router.get('/', (req, res) => {
    res.redirect(302, 'http://elev8inc.wixsite.com/welcome');
    // http.get({
    //     hostname: 'http://www.kristinvandeusen.wix.com',
    //     port: 80,
    //     path: '/elev8',
    //     agent: false  // create a new agent just for this one request
    // }, (res2) => {
    //     var body = '';
    //     res2.on('data', function(d) {
    //         body += d;
    //     });
    //     res2.on('end', function() {
    //         res.send(body);
    //     });
    // });
});

module.exports = router;
