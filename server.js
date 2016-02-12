
/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express')
, http = require('http')
, path = require('path')
, passport = require('passport')
, mongoose = require('mongoose')
, expressSession = require('express-session')
, bodyParser = require('body-parser');
/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* load configuration settings from ENV, then settings.json.  Contains keys for OAuth logins. See
* settings.example.json.
**/

mongoose.connect(require('./configs/database').mongodb);

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));


/**
* ROUTING
* -------------------------------------------------------------------------------------------------
* include a route file for each major area of functionality in the site
**/
require('./routes/account')(app);
require('./routes/global')(app, passport);
app.use('/home',require('./routes/home'));


var server = http.createServer(app);

/**
* CHAT / SOCKET.IO
* -------------------------------------------------------------------------------------------------
* this shows a basic example of using socket.io to orchestrate chat
**/

// socket.io configuration
var buffer = [];
var io = require('socket.io').listen(server);


io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 100);
});

io.sockets.on('connection', function (socket) {
    socket.emit('messages', { buffer: buffer });
    socket.on('setname', function (name) {
        socket.set('name', name, function () {
            socket.broadcast.emit('announcement', { announcement: name + ' connected' });
        });
    });
    socket.on('message', function (message) {
        socket.get('name', function (err, name) {
            var msg = { message: [name, message] };
            buffer.push(msg);
            if (buffer.length > 15) buffer.shift();
            socket.broadcast.emit('message', msg);
        })
    });
    socket.on('disconnect', function () {
        socket.get('name', function (err, name) {
            socket.broadcast.emit('announcement', { announcement: name + ' disconnected' });
        })
    })
});


/**
* RUN
* -------------------------------------------------------------------------------------------------
* this starts up the server on the given port
**/

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
