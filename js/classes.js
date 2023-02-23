// create class to create object

class Sprite {
  // one main property in game dev on any object is position. passing a paramter as object makes it easier to run the code
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    // player properties
    this.position = position;

    // add width property
    this.width = 50;
    // add a height property
    this.height = 150;

    // create a new image with every new instance of sprite
    this.image = new Image();
    this.image.src = imageSrc;

    // add property to scale different images
    this.scale = scale;

    // create max frams
    this.framesMax = framesMax;

    // create current frame
    this.framesCurrent = 0;

    // slow down animation
    // how many frames has elapsed
    this.framesElapsed = 0;
    // how many frames we need to go through - the lower it is the faster it will go
    this.framesHold = 15;

    // offset character
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      //   cropping the shop image
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  //   method for moving animation by frames

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

// take all methods from sprite and implement them to the fighter class
class Fighter extends Sprite {
  // one main property in game dev on any object is position. passing a paramter as object makes it easier to run the code
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    // create an object that contains all sprites for the specific fghter
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    // call the constructor of the parent
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    // player properties
    // this.position = position;
    // once we create our infinite loop (animate function below), we can apply it to our player and enemy positions
    this.velocity = velocity;
    // add width property
    this.width = 50;
    // add a height property
    this.height = 150;
    // create a variable to allow the last key pressed to take priority (overridin gthe direction in which players should be moving)
    this.lastKey;

    // ATTACKS
    // attack properties
    this.attackBox = {
      // ensure position for player and enemy is different
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.color = color;
    this.isAttacking;
    this.health = 100;
    // create current frame
    this.framesCurrent = 0;

    // slow down animation
    // how many frames has elapsed
    this.framesElapsed = 0;
    // how many frames we need to go through - the lower it is the faster it will go
    this.framesHold = 15;
    // pass through sprite object
    this.sprites = sprites;

    // loop thorugh sprite object
    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  //   what player looks like
  //   no longer needed as fighters will not be a box
  //   draw() {
  //     // ensure it differenciates from black canvas
  //     c.fillStyle = this.color;
  //     // referencing the object below using the constructor class above
  //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //     // attack box drawing
  //     // only show attack box when attacking
  //     if (this.isAttacking) {
  //       c.fillStyle = "green";
  //       c.fillRect(
  //         this.attackBox.position.x,
  //         this.attackBox.position.y,
  //         this.attackBox.width,
  //         this.attackBox.height
  //       );
  //     }
  //   }

  //   when moving objects around, it is a good idea to initiate a new method in our class
  update() {
    this.draw();
    this.animateFrames();

    // attack boxes
    // offset enemy attackbox position as well (50 is width of sprite)
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw the attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // overtime, y will have 10 pixels moved each time it loops
    // this.position.y += 10;

    // reference how the player will move on the x axis
    this.position.x += this.velocity.x;

    // to ensure that the players stop moving at the bottom of the canvas, we need to add velocity
    this.position.y += this.velocity.y;

    // if the position of the height of the velocity is greater than the height of the canvas, set the velocity to 0 which stops the object (player) from moving past the canvas
    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      //   fix flash due to velocity and gravity code
      this.position.y = 330;
    }
    // gravity is only added if the object is above canvas height
    else this.velocity.y += gravity;
  }

  // create an attack method (ie drawing out weapon)

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    // set a timer to activate for a certain period of time
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }

  //   add method for switching sprites
  // make sure framesmax is also set once for  every state
  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          //  reset the current frame when switching sprites
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
