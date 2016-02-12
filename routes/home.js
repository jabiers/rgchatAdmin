var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('index', { title: 'Home Page.  ' })
});

// chat area
router.get('/chat', function (req, res) {
    res.render('chat', { title: 'Chat with Me!  ' })
});

// about page
router.get('/about', function (req, res) {
    res.render('about', { title: 'About Me.  ' })
});

module.exports = router;
