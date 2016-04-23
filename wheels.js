var five = require("johnny-five");

var Wheel = function(pwmPin, directPin, speedParam){
  var motor = new five.Motor({
      pins: {
        pwm: pwmPin,
        dir: directPin
      },
      invertPWM: true
  }),
  speed = speedParam || 256;

  this.stop = function(){
    motor.stop();
  }

  this.forward = function(){
    motor.forward(speed);
  }

  this.reverse = function(){
    motor.reverse(speed);
  }
}

module.exports = Wheel;
