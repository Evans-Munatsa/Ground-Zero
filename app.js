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
    // board = new five.Board({
    //     port: '/dev/tty.CAPEBOT2-DevB'
    // });
    board = new five.Board();


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

        socket.on('click1', function() {
            console.log('backward');
            robot.reverse();
            say.speak('Reverse', 'Alex', 1);

        });

        socket.on('click2', function() {
            console.log('Left');
            say.speak('Left', 'Alex', 1);
            robot.left();
        });

        socket.on('click3', function() {
            say.speak('Right', 'Alex', 1);
            console.log('Right');
            robot.right();
        });

    socket.on('click4', function() {
        say.speak('Stop', 'Alex', 1);
        console.log('stopping');
        robot.stop();
    });
  });

});

var port = process.env.port || 3007;
http.listen(port, function() {
    console.log('running at port :', port)
});
