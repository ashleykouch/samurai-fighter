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

// CREATING PLAYER AND ENEMY

// create a global variable for gravity after defining velocity as there is a gap between the player object and the bottom of the canvas

const gravity = 0.7;

// create class to create object

class Sprite {
  // one main property in game dev on any object is position. passing a paramter as object makes it easier to run the code
  constructor({ position, velocity, color = "red" }) {
    // player properties
    this.position = position;
    // once we create our infinite loop (animate function below), we can apply it to our player and enemy positions
    this.velocity = velocity;
    // add width property
    this.width = 50;
    // add a height property
    this.height = 150;
    // create a variable to allow the last key pressed to take priority (overridin gthe direction in which players should be moving)
    this.lastKey;

    // attack properties
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };

    this.color = color;
  }

  //   what player looks like
  draw() {
    // ensure it differenciates from black canvas
    c.fillStyle = this.color;
    // referencing the object below using the constructor class above
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box drawing
    c.fillStyle = "green";
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  //   when moving objects around, it is a good idea to initiate a new method in our class
  update() {
    this.draw();

    // overtime, y will have 10 pixels moved each time it loops
    // this.position.y += 10;

    // reference how the player will move on the x axis
    this.position.x += this.velocity.x;

    // to ensure that the players stop moving at the bottom of the canvas, we need to add velocity
    this.position.y += this.velocity.y;

    // if the position of the height of the velocity is greater than the height of the canvas, set the velocity to 0 which stops the object (player) from moving past the canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      // gravity is only added if the object is above canvas height
      this.velocity.y += gravity;
    }
  }
}

// create player
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  // player does not move by default
  velocity: {
    x: 0,
    y: 0,
  },
});

// call our player - to see intial position
// player.draw();

// create enemy
const enemy = new Sprite({
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

// adding gravity and velocity by creating an infinite animation loop
function animate() {
  window.requestAnimationFrame(animate);
  //   make sure to clear the canvas after every loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //   ensure our player and enemy is called every frame within our animation loop
  player.update();
  enemy.update();

  //   for each animation loop we will be listenign to whetehr or not our key is pressed down or up (from event listeners below) - ensure we set initial velocity to 0 before the player velocity is set to move (i.e. number)

  //   player movement
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
  }

  //   enemy movement
  enemy.velocity.x = 0;

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //   detect for player collisions
  // if the side of the attack box touches the enemy

  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width
  ) {
    console.log("go");
  }
}

animate();

// MOVING PLAYERS WITH EVENT LISTENERS

// every time we press down
window.addEventListener("keydown", (event) => {
  console.log(event.key);
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
  }
  console.log(event.key);
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
  console.log(event.key);
});

// ATTACKS
