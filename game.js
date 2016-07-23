'use strict';

function createPipeHeight() {
  var upperPipeHeight = Math.floor(Math.random() * 3) + 1;
  var lowerPipeHeight = 4.8 - upperPipeHeight;

  return {
    upper: upperPipeHeight * 100,
    lower: lowerPipeHeight * 100
  };
}

function createPipeHtml(pipeHeight, i) {
  var upperPipeHtml = '<div class=pipe-'+ i  + ' style="height: ' + pipeHeight.upper + 'px; width: 50px"></div>';

  var lowerPipeHtml = '<div style="height: ' + pipeHeight.lower + 'px; width: 50px"></div>';

  //var pipeNumber = `<div class="pipeVal">${i}</div>`

  var pipeHtml = '<div class="pipe">' + upperPipeHtml + lowerPipeHtml + '</div>';

  return pipeHtml;
}

function createPipes(n) {

  var pipesHtml = []

  for (var i = 0; i < n; i++) {
    pipesHtml.push(createPipeHtml(createPipeHeight(), i))
  }

  return pipesHtml;
}

$('.pipes').html(createPipes(50));


var initialState = {
  bird: {
    posY: 0,
    bottomY : 30,
    posX : 165,
    velocity: 2,
    directionTimeout: undefined
  },
  pipes: {
    posX: 300,
    velocity: -1
  },
  nextPipe : {
    value : 0,
    leftX : 0,
    rightX : 0,
    topPipeY : 0,
    bottomPipeY : 0
  },
  end: false,
  gameInterval: undefined
};

var state = JSON.parse(JSON.stringify(initialState));

function gameStart() {
  var frame = $('.frames');
  var i = 0;

  function renderLoop() {

    frame.text(i);
    i += 1;

    if (state.bird.posY === 570 || state.bird.posY < -30 || state.end) {
      return gameEnd();
    }

    movePipesPlane();

    moveBird();

    nextPipePos();

    collisionCheck();

    checkStop();

  }

  state.gameInterval = setInterval(renderLoop, 16);
}

function moveBird() {
  state.bird.posY += state.bird.velocity;
  state.bird.bottomY += state.bird.velocity;

  $('.bird').css({ transform: 'translate(35px, ' + state.bird.posY + 'px)' });
}

function movePipesPlane() {
  state.pipes.posX += state.pipes.velocity;

  $('.pipes').css({ transform: 'translateX(' + state.pipes.posX + 'px)' });
}


function nextPipePos() {

  var leftPad = 100;
  var baseLength = state.pipes.posX + leftPad;
  var value = state.nextPipe.value;
  var nextPipe = state.nextPipe;
  var topPipe = $('.pipe-' + value);
  var pipeGap = 120;
  var spaceBetweenPipes = 200;

  if(value > 0){
    nextPipe.leftX = baseLength + (spaceBetweenPipes + topPipe.width() * value);
  } else {
    nextPipe.leftX = baseLength;
  }
  //console.log(state.bird.bottomY, state.nextPipe.value, state.nextPipe.bottomPipeY);
  nextPipe.rightX = nextPipe.leftX + topPipe.width();
  nextPipe.topPipeY = topPipe.height();
  nextPipe.bottomPipeY = topPipe.height() + pipeGap;
}

function collisionCheck() {
  var bird = state.bird;
  var nextPipe = state.nextPipe;

  if (bird.posX >= nextPipe.leftX) {
    //console.log("X Meet");
    if (bird.posY <= nextPipe.topPipeY || bird.bottomY >= nextPipe.bottomPipeY) {
      console.log("birdPosY : " + bird.posY, "topPipeY : " + nextPipe.topPipeY,
      "birdPosBottomY : " + bird.bottomY, "bottomPipeY : " + nextPipe.bottomPipeY);
      gameEnd();
      state.end = true;
    }
    if (bird.posX - 30 > nextPipe.rightX) {
      $(".score").text(+1);
      updatePipe();
    }
  }
}

function updatePipe() {
  state.nextPipe.value += 1;
}

$(".start").click(function () {

  if (state.end) {
    $(".start").hide();
    restartGame();
  } else {
    $(".start").hide();
    gameStart();
  }
});

function gameEnd() {
  $(".gameZone").css("opacity", 0.3);
  $(".start").text("RESTART");
  $(".start").show();

  clearInterval(state.gameInterval);
  state.gameInterval = undefined;

  return;
}

function checkStop() {
  $('.stop').click(function () {
    state.end = true;
  });
}

$('.gameZone').click(function () {

  if (state.bird.directionTimeout) {
    clearTimeout(state.bird.directionTimeout);
    state.bird.directionTimeout = undefined;
  }

  state.bird.velocity = -3;

  state.bird.directionTimeout = setTimeout(function () {
    state.bird.velocity = 2;
  }, 300);
});

function restartGame() {
  state = JSON.parse(JSON.stringify(initialState));


  $(".gameZone").css("opacity", 1);
  $(".bird").css({transform : "translateY(0)"});
  $('.pipes').css({ transform: 'translateX(300px)' });

  $(".score").text(0);

  gameStart();
}
