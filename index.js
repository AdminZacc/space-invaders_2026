const scoreEl = document.querySelector("#scoreEl");
const hi_scoreEl = document.querySelector("#hiScoreEl");
const canvas = document.querySelector("canvas");
const gameOverModal = document.getElementById("gameOverModal");
const closeButton = document.getElementById("closeButton");
const restartButton = document.getElementById("restartButton");
const finalScoreElement = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
let game = { active: false,};
document.getElementById("startButton").addEventListener("click", () => {
  if (!game.active) {
    document.getElementById("startButton").style.display = "none";
    game.active = true; // Set the game as active when start button is clicked
    animate();
  }
});

class Player {
  constructor() {
    this.position = {
      x: 200,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;

    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }
  draw() {
    // c.fillStyle = "red";
    //c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    c.rotate(this.rotation);

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 4;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }
  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades == true) {
      this.opacity -= 0.01;
    }
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }
  draw() {
    c.fillStyle = "#ccccff";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }
  draw() {
    // c.fillStyle = "red";
    //c.fillRect(this.position.x, this.posSition.y, this.width, this.height);

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height / 2,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.invaders = [];

    const columns = Math.floor(Math.random() * 10 + 10);
    const rows = Math.floor(Math.random() * 5 + 5);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
    
    
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
  
}

class PowerUp {
  constructor() {
    this.position = {
      x: Math.random() * canvas.width,
      y: 20, // Start above the canvas
    };

    this.velocity = {
      x: Math.random() > 0.5 ? 2 : -2, // Move either left or right
      y: 0,
    };

    this.radius = 20;
    this.color = "#00FF00"; // Green color for the power-up
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    
    if (this.invaders.length > 0) {
      const invaderBottom = Math.max(
        ...this.invaders.map((invader) => invader.position.y + invader.height)
      );

      if (invaderBottom >= canvas.height) {
        // Invader reached the bottom of the canvas
        game.active = false;
        showGameOverModal();
      }
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.draw();
  }
}



const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
};

let score = 0;
let hi_score = 0;
let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);

document.getElementById("startButton").addEventListener("click", function () {
  
});

// explosion effects
for (let i = 0; i < 15; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}
function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color || "#BAA0DE",
        fades: fades,
      })
    );
  }
}
let animationId;

function animate() {
  if (!game.active) return;

  animationId = requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
    particle.update();
  });

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else invaderProjectile.update();

    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.active = false;
      }, 0);

      createParticles({
        object: player,
        color: "white",
        fades: true,
      });
      console.log("you lose!");
      if (game.active) {
        setTimeout(() => {
          game.active = false;
          showGameOverModal();
        }, 2000);
      }
    }
  });


  

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update(canvas);

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      // projectiles hit invader
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );
            // Remove invader and projectile
            if (invaderFound && projectileFound) {
              score += 100;
              console.log(score);
              
              scoreEl.textContent = score; // Update score in HTML
              createParticles({
                object: invader,
                fades: true,
              });

              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        
        }
      });
    });
  });

  function showGameOverModal() {
    gameOverModal.style.display = "block";
    finalScoreElement.textContent = score;
    scoreEl.textContent = score;
    hi_scoreEl.textContent = hi_score;
  }
  // Event listener for the close button
  closeButton.addEventListener("click", () => {
    gameOverModal.style.display = "none";
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.rotation = 0;
    player.velocity.x = 0;
  }
 

  // Spawning enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
    
  }

  frames++;
}

animate();

function resetPlayer() {
  if (!game.active) {
    player.position = {
      x: canvas.width / 2 - player.width / 2,
      y: canvas.height - player.height - 20,
    };
  }
}


addEventListener("keydown", ({ key }) => {
  if (!game.active) return;

  switch (key) {
    case "a":
      
      keys.a.pressed = true;
      break;

    case "d":
      
      keys.d.pressed = true;
      break;

    case " ": // Change this line to "space"
      keys.space.pressed = true;
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          },
        })
      );
      
      break;

    case "q":
      //console.log("quit");
      keys.q.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      //console.log("left");
      keys.a.pressed = false;
      break;

    case "d":
      //console.log("right");
      keys.d.pressed = false;
      break;

    case " ":
      //console.log("space");

      keys.space.pressed = false;
      break;

    case "q":
      //console.log("quit");
      keys.q.pressed = false;
      break;
  }
});

// Event listener for the restart button
restartButton.addEventListener("click", () => {
  cancelAnimationFrame(animationId); // Cancel the existing animation frame
  resetGame(); // Reset the game state
  animate(); // Start a new game
  gameOverModal.style.display = "none";
});


function resetGame() {
  game.active = false;
  if (score > hi_score) {
    hi_score = score;
    document.getElementById("hiScoreEl").textContent = hi_score;
  }
  player.opacity = 1;
  grids.length = 0;
  particles.length = 0;
  projectiles.length = 0;
  invaderProjectiles.length = 0;
  frames = 0;
  resetPlayer()
  game.active = true;
  score = 0;
  scoreEl.textContent = score; // Update score in HTML
}
