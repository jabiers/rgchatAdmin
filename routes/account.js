var passport = require('passport');

module.exports = function(app) {

    // user account page
    app.get('/account', function(req, res) {
        res.render('account/account', { user: req.user });
    });

    app.get('/login',
      passport.authenticate('bearer'),
      function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/');
      });

    // logout
    app.get('/logout', function(req, res) {
        res.redirect('/');
    });
}
