// function for collision between two rectangles
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    //   detect for play collision on y axis
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// function for showing end game text
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
}

// function to decrease timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    // create a loop for timer
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    // display timer in html document
    document.querySelector("#timer").innerHTML = timer;
  }

  //   determine who wins the game when timer runs out
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
