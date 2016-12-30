$(document).ready(function(){

  /* Increment and decrement work and break time length */
  document.getElementById("breakCount").innerHTML = 5;
  document.getElementById("workCount").innerHTML = 25;
  document.getElementById("timer").innerHTML = 25 + ":" + "00";
  $('#break .decr').on('click', function(){
    var bCount = document.getElementById("breakCount").innerHTML;
    if (bCount > 1){
      bCount--;
      document.getElementById("breakCount").innerHTML = bCount;
    }
  });
  $('#break .incr').on('click', function(){
    var bCount = document.getElementById("breakCount").innerHTML;
    if (bCount < 60){
      bCount++;
      document.getElementById("breakCount").innerHTML = bCount;
    }
  });
  $('#work .decr').on('click', function(){
    var wCount = document.getElementById("workCount").innerHTML;
    if (wCount > 1){
      wCount--;
      document.getElementById("workCount").innerHTML = wCount;
      document.getElementById("timer").innerHTML = wCount + ":" + "00";
    }
  });
  $('#work .incr').on('click',  function(){
    var wCount = document.getElementById("workCount").innerHTML;
    if (wCount < 60){
      wCount++;
      document.getElementById("workCount").innerHTML = wCount;
      document.getElementById("timer").innerHTML = wCount + ":" + "00";
    }
  });

  /* Clock mechanisms */
  var hasStarted = false; // for preventing multiple concurrent setIntervals
  var hasPaused = false;
  var hasReset = false;
  var onBreak = false;
  var session;
  var workTime, breakTime;
  var timeRemaining, minutesRem, secondsRem;
  var audio = new Audio("assets/Spit_Splat-Mike_Koenig-1170500447.mp3");

  function startSession(timer) {
    session = setInterval(function(){
      var minutes = parseInt(timer / 60, 10);
      var seconds = parseInt(timer % 60, 10);
      seconds = (seconds < 10) ? "0"+seconds : seconds;
      document.getElementById("timer").innerHTML = minutes + ":" + seconds;
      if (timer === 1){
        $(".clock").removeClass("rollIn");
        $(".clock").addClass("rollOut");
        audio.play();
      }
      if (--timer < 0){
        $(".clock").removeClass("rollOut");
        $(".clock").addClass("rollIn");
        if (!onBreak){
          onBreak = true;
          $("#timerLabel").text("break");
          timer = breakTime * 60;
        } else {
          onBreak = false;
          $("#timerLabel").text("work");
          timer = workTime * 60;
        }
      }
    }, 1000);
  }

  $("#start").on('click', function(){
    hasReset = false;
    if (!hasPaused && !hasStarted){ // not started after a pause or previous start
      hasStarted = true;
      $("#timerLabel").text("work");
      workTime = document.getElementById("workCount").innerHTML;
      breakTime = document.getElementById("breakCount").innerHTML;
      var time = workTime * 60;
      startSession(time);
    } else if (hasPaused && !hasStarted){ // resume from pause
      hasPaused = false;
      hasStarted = true;
      var time = (minutesRem * 60) + secondsRem;
      startSession(time);
    }
  });
  $("#pause").on('click', function(){
    if (!hasPaused){
      clearInterval(session);
      hasPaused = true;
      hasStarted = false;
      timeRemaining = document.getElementById("timer").innerHTML;
      minutesRem = parseInt(timeRemaining, 10);
      secondsRem = (timeRemaining.length === 5) ? parseInt(timeRemaining.substr(3, 2), 10) : parseInt(timeRemaining.substr(2, 2), 10);
    }
  });
  $("#reset").on('click', function(){
    if (hasStarted || hasPaused){
      clearInterval(session);
      hasReset = true;
      hasStarted = false;
      $("#timerLabel").text("session");
      document.getElementById("timer").innerHTML = workTime+":00";
    }
  });
});
