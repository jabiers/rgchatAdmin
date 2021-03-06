var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(app, passport){

	/* GET login page. */
	app.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
            res.render('index', { user:req.user, title: 'Home Page.  ' })
	});

	/* Handle Login POST */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
	}));

	/* GET Registration Page */
	app.get('/signup', function(req, res){
		res.render('register',{user:""});
	});

	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
	}));

	/* GET Home Page */
	app.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user|"aaa" });
	});

	/* Handle Logout */
	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return app;
}
