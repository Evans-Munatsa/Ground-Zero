const express = require('express'),
    expressHandlebars = require('express-handlebars'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    five = require('johnny-five'),
    Wheel = require('./wheels'),
    Robot = require('./robot'),
    say = require('say'),
    express = require('express'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    locations = require('./locations'),
    join = require('./join'),
    http = require('http'),
    socket_io = require('socket.io'),
    DataService = require('./data-service'),
    api = require('./api'),
    connectionProvider = require('connection-provider');
    board = new five.Board({
        port: '/dev/tty.CAPEBOT2-DevB'
    });

    var dbOptions = {
          host: 'localhost',
          user: 'geo',
          password: 'password',
          port: 3306,
          database: 'geolocation'
    };

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.engine('hbs', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(connectionProvider(dbOptions, function(connection){
    return {
        dataService : new DataService(connection)
    }
}));
app.get('/', function(req,res){
  res.render('index');
});
app.get('/locations/add', locations.showAdd);
app.get('/locations/delete/:locationId', locations.delete);
app.post('/locations/add', locations.add);
app.get('/join/<location_id>', join.home);

app.get('/api/distance/:from/:to', api.distance_from);
app.get('/api/center', api.center);
app.get('/api/in_circle/:from/:to/:distance', api.distance);
app.get('/api/nearest/:from', api.nearest);
app.get('/api/selected/:id', api.get_all);
app.get('/api/locations', api.locations);

board.on("ready", function() {

    var wheel1 = new Wheel(9, 8, 180),
        wheel2 = new Wheel(6, 7, 180);

    var robot = new Robot(wheel1, wheel2);
    this.repl.inject({
        robot: robot
    });

    io.sockets.on('connection', function(socket) {
        socket.on('click', function() {
            console.log('Forward');
            robot.forward();
            say.speak('Forward', 'Alex', 1);
        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('click1', function() {
            console.log('backward');
            robot.reverse();
            say.speak('Reverse', 'Alex', 1);

        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('click2', function() {
            console.log('Left');
            say.speak('Left', 'Alex', 1);
            robot.left();
        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('click3', function() {
          say.speak('Right', 'Alex', 1);
            console.log('Right');
            robot.right();
        });
    });

    io.sockets.on('connection', function(socket) {
        socket.on('click4', function() {
          say.speak('stopping', 'Alex', 1);
            console.log('stopping');
            robot.stop();
        });
    });

});

var port = process.env.port || 3007;
http.listen(port, function() {
    console.log('running at port :', port)
});
