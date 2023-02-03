// PROJECT SETUP

// changing size of canvas to fit screens
const canvas = document.querySelector("canvas");
// select canvas context (2d or 3d game) - we can use this to draw shapes
const c = canvas.getContext("2d");

// resizing canvas through js - can change to css if needed
canvas.width = 1024;
canvas.height = 576;

// (argumeents: x, y, width, height)
c.fillRect(0, 0, canvas.width, canvas.height);

// insert background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./imgs/background.png",
});

// insert shop background for animation
const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imageSrc: "./imgs/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// CREATING PLAYER AND ENEMY

// create a global variable for gravity after defining velocity as there is a gap between the player object and the bottom of the canvas

const gravity = 0.8;

// create player
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  // player does not move by default
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

// call our player - to see intial position
// player.draw();

// create enemy
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  // enemy does not move by default
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

// call our enemy - to see intial position
// enemy.draw();

console.log(player);

// ANIMATION

// ensure we can have an accurate game movement
const keys = {
  // player keys
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  // enemy keys
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

// adding gravity and velocity by creating an infinite animation loop
function animate() {
  window.requestAnimationFrame(animate);
  //   make sure to clear the canvas after every loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //   render background by calling update to draw the image
  background.update();

  //   render shop by calling update to draw the image
  shop.update();
  //   ensure our player and enemy is called every frame within our animation loop
  player.update();
  enemy.update();

  //   for each animation loop we will be listenign to whetehr or not our key is pressed down or up (from event listeners below) - ensure we set initial velocity to 0 before the player velocity is set to move (i.e. number)

  //   player movement
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 3;
  }

  //   enemy movement
  enemy.velocity.x = 0;

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -3;
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 3;
  }

  //   detect for player collisions on x axis

  //   detect for play collision on y axis
  // if the side of the attack box touches the enemy

  //   player attacking
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    // add conditional for if player is attacking
    player.isAttacking
  ) {
    player.isAttacking = false;
    // enemy health bar decrease when hit
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //   enemy attacking
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //   end game if a players health bar reaches 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// MOVING PLAYERS WITH EVENT LISTENERS

// every time we press down
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      // call code that moves player - move player by 1 frame for ever loop
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      // call code that moves player - move player by 1 frame for ever loop
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      // beacause we added gravity, the player will always fall
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    //   enemy cases
    case "ArrowRight":
      // call code that moves player - move player by 1 frame for ever loop
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      // call code that moves player - move player by 1 frame for ever loop
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      // beacause we added gravity, the player will always fall
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

// listen for event when play stops pressing on key
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      // call code that moves player - move player by 1 frame for ever loop
      keys.d.pressed = false;
      break;
    case "a":
      // call code that moves player - move player by 1 frame for ever loop
      keys.a.pressed = false;
      break;

    // enemy cases
    case "ArrowRight":
      // call code that moves player - move player by 1 frame for ever loop
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      // call code that moves player - move player by 1 frame for ever loop
      keys.ArrowLeft.pressed = false;
      break;
  }
});
