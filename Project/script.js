let username = localStorage.getItem("username");
//Binding
const button = document.getElementById("btn");
const usernameInput = document.getElementById("name");
const playDiv = document.getElementById("play");
const inputForm = document.getElementById("gameOver");
const hallOfFame = document.getElementById("halloffame");

//Fetch
const token = "7361c8b2-ce70-49e3-9b58-4fd55927a909";
const urlGet = "https://ws.progettimolinari.it/cache/get";
const urlPost = "https://ws.progettimolinari.it/cache/set";
const key = "pacman";

let userScoreBoard = [];
const templateStart = `
        <h1 class="head">Hall of Fame:</h1>
\n`;
const template = `<div class="row white">
                    <div class="col-3"></div>
                    <div class="col">
                      <p class="head white">%position .</p>
                    </div>
                    <div class="col">
                       <p class="head white">%username</p>
                    </div>
                    <div class="col">
                        <p class="head white">%score</p>
                    </div>
                    <div class="col-3"></div>
                  </div>
\n`;
const templateEnd = `<div class="row show">
                      <div class="col-12"><button type="button" id="playAgain" class="btn btn-outline-warning">Play Again!</button></div>
                    </div>
\n`;

//Dichiarazione delle variabili canvas
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const countLevel = document.getElementById("countLevel");

let scared = false;
const width = canvas.width;
const height = canvas.height;
let finished = false;
let previousTime = 0;

//Variabili si gioco
let level = 1;
const MAX = 256;
let score = 0;
let eaten = 0;
let lvlScore = 0;
let screen = [true, false, false];

//Matrice della mappa
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],//0
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//1
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],//2
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],//3
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//4
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],//5
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],//6
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],//7
  [-1, -1, -1, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, -1, -1, -1],//8
  [-1, -1, -1, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, -1, -1, -1],//9
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],//10
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2/*cella fantasmi*/, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1],//11
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 2, 2, 2, 1, 0, 1, 0, 1, 1, 1, 1, 1],//12
  [-1, -1, -1, -1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, -1, -1, -1, -1],//13
  [-1, -1, -1, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, -1, -1, -1, -1],//14
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],//15
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//16
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],//17
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],//18
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],//19
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],//20
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],//21
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//22
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//23
];

let pointsMap = structuredClone(map);

//Disegno powerUps
pointsMap[1][1] = 3; //in alto a sinistra
pointsMap[1][19] = 3; //in alto a destra
pointsMap[22][1] = 3; //in basso a sinistra
pointsMap[22][19] = 3; //in basso a destra

let target = 0;
for (let i = 0; i < pointsMap.length; i++) {
  for (let j = 0; j < pointsMap[i].length; j++) {
    if (pointsMap[i][j] === 0) {
      target++;
    }
  }
}


//ResetLevel
const reset = () => {
  if (life.vite === 0) {
    life.vite = 3;
    pointsMap = structuredClone(map);
    target = 0;
    for (let i = 0; i < pointsMap.length; i++) {
      for (let j = 0; j < pointsMap[i].length; j++) {
        if (pointsMap[i][j] === 0) {
          target++;
        }
      }
    }
    //Disegno powerUps
    pointsMap[1][1] = 3; //in alto a sinistra
    pointsMap[1][19] = 3; //in alto a destra
    pointsMap[22][1] = 3; //in basso a sinistra
    pointsMap[22][19] = 3; //in basso a destra
    eaten = 0;
    lvlScore = 0;
    newObj = false;
    drawn = true;
    level = 1;
  }
  actualFunction = undefined;
  pacman.j = 10;
  pacman.i = 14;
  finished = false;
  ghosts.blinky.i = 10;
  ghosts.blinky.j = 10;
  ghosts.inky.i = 12;
  ghosts.inky.j = 9;
  ghosts.pinky.i = 12;
  ghosts.pinky.j = 10;
  ghosts.clyde.i = 12;
  ghosts.clyde.j = 11;
  Object.keys(ghosts).forEach((key) => ghosts[key].start = false)
}

//Vite
const life = {
  vite: 3,
  heart: () => {
    let img = new Image()
    img.src = "./assets/RIGHT-PacMan/1.png";

    let check = false;
    img.onload = function() {
      check = true;
    }
    return () => {
      if (life.vite === 0) {
        //Appare schermata hai perso
        finished = true;
      }
      else if (score >= 10000) {
        life.vite++;
      }
      let x = width / 10 - width / 13;
      if (check) {
        for (let i = 0; i < life.vite; i++) {
          ctx.drawImage(img, x, height - height / 15, 35, 35);
          x += 50;
        }
      }
    }
  }
}



//PUNTI
const points = {
  balls: {
    point: 10,
    x: 35,
    y: 35,
    dim: 5,
    draw: () => {
      const CELLS = 21;
      ctx.fillStyle = "pink";
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < CELLS; j++) {
          if (pointsMap[i][j] === 0) {
            ctx.fillRect(j * points.balls.x + points.balls.x / 2, i * points.balls.y + points.balls.y / 2, points.balls.dim * 2, points.balls.dim * 2);
          }
        }
      }
    },
  },

  powerup: {
    point: 50,
    x: 35,
    y: 35,
    dim: 50,
    ability: (() => {
      let keys = Object.keys(ghosts);
      for (let i = 0; i < keys.length; i++) {
        ghosts[keys[i]].blueGhost.draw();
        ghosts[keys[i]].blueGhost.behavior();
      }
    }),
    draw: (blink) => {
      ctx.fillStyle = "pink";
      for (let i = 0; i < pointsMap.length; i++) {
        for (let j = 0; j < pointsMap[i].length; j++) {
          if (pointsMap[i][j] === 3) {
            if (blink % 25 === 0) {
              ctx.beginPath();
              ctx.arc(j * points.powerup.x + points.powerup.x / 2, i * points.powerup.y + points.powerup.y / 2, points.balls.dim, 0, 2 * Math.PI);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(j * points.balls.x + points.balls.x / 2, i * points.balls.y + points.balls.y / 2, points.balls.dim * 2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      }
    }
  },

  cherry: {
    achieve: 70,
    point: 100,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.cherry.check)
        ctx.drawImage(points.cherry.img, 10 * points.cherry.diam, 14 * points.cherry.diam, points.cherry.diam, points.cherry.diam);
    })
  },

  strawberry: {
    achieve: 170,
    point: 300,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.strawberry.check)
        ctx.drawImage(points.strawberry.img, 10 * points.strawberry.diam, 14 * points.strawberry.diam, points.strawberry.diam, points.strawberry.diam);
    })
  },

  orange: {
    achieve: 270,
    point: 500,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.orange.check)
        ctx.drawImage(points.orange.img, 10 * points.orange.diam, 14 * points.orange.diam, points.orange.diam, points.orange.diam);
    })
  },

  apple: {
    achieve: 470,
    point: 700,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.apple.check)
        ctx.drawImage(points.apple.img, 10 * points.apple.diam, 14 * points.apple.diam, points.apple.diam, points.apple.diam);
    })
  },

  grape: {
    achieve: 670,
    point: 1000,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.grape.check)
        ctx.drawImage(points.grape.img, 10 * points.grape.diam, 14 * points.grape.diam, points.grape.diam, points.grape.diam);
    })
  },

  galaxian: {
    achieve: 870,
    point: 2000,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.galaxian.check)
        ctx.drawImage(points.galaxian.img, 10 * points.galaxian.diam, 14 * points.galaxian.diam, points.galaxian.diam, points.galaxian.diam);
    })
  },

  bell: {
    achieve: 1070,
    point: 3000,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.bell.check)
        ctx.drawImage(points.bell.img, 10 * points.bell.diam, 14 * points.bell.diam, points.bell.diam, points.bell.diam);
    })
  },

  key: {
    achieve: 1270,
    point: 5000,
    img: new Image(),
    diam: 35,
    check: false,
    draw: (() => {
      if (points.key.check)
        ctx.drawImage(points.key.img, 10 * points.key.diam, 14 * points.key.diam, points.key.diam, points.key.diam);
    })
  },
};

{
  points.cherry.img.onload = function() {
    points.cherry.check = true;
  }
  points.cherry.img.src = "./assets/Points/Ciliegia.png";

  points.strawberry.img.onload = function() {
    points.strawberry.check = true;
  }
  points.strawberry.img.src = "./assets/Points/fragola.png";

  points.orange.img.onload = function() {
    points.orange.check = true;
  }
  points.orange.img.src = "./assets/Points/Arancia.png";

  points.apple.img.onload = function() {
    points.apple.check = true;
  }
  points.apple.img.src = "./assets/Points/Apple.png";

  points.grape.img.onload = function() {
    points.grape.check = true;
  }
  points.grape.src = "./assets/Points/Uva.png";

  points.galaxian.img.onload = function() {
    points.galaxian.check = true;
  }
  points.galaxian.src = "./assets/Points/Navicella.png";

  points.bell.img.onload = function() {
    points.bell.check = true;
  }
  points.bell.src = "./assets/Points/Campana.png";

  points.key.img.onload = function() {
    points.key.check = true;
  }
  points.key.src = "./assets/Points/Chiave.png";
}


//FANTASMINI
const ghosts = {
  //Rosso
  blinky: {
    i: 10,
    j: 10,
    check: false,
    start: false,
    img: new Image(),
    draw: (() => {
      if (ghosts.blinky.check)
        ctx.drawImage(ghosts.blinky.img, ghosts.blinky.j * 35, ghosts.blinky.i * 35, 35, 35);
    }),
    //BlueGhost
    blueGhost: {
      check: false,
      img: new Image(),
      draw: (() => {
        if (ghosts.blinky.blueGhost.check)
          ctx.drawImage(ghosts.blinky.blueGhost.img, ghosts.blinky.j * 35, ghosts.blinky.i * 35, 35, 35);
      }),
      behavior: () => {
        if (pacman.i === ghosts.blinky.i && pacman.j === ghosts.blinky.j) {
          ghosts.blinky.i = 10;
          ghosts.blinky.j = 10;
          score += 400;
          ghosts.blinky.start = false;
        }

        if ((pacman.i < ghosts.blinky.i && pacman.j === ghosts.blinky.j)
          && map[ghosts.blinky.i + 1][ghosts.blinky.j] === 0) {
          ghosts.blinky.i++;
        }
        else if ((pacman.i > ghosts.blinky.i && pacman.j === ghosts.blinky.j)
          && map[ghosts.blinky.i - 1][ghosts.blinky.j] === 0) {
          ghosts.blinky.i--;
        }

        else if ((pacman.i === ghosts.blinky.i && pacman.j < ghosts.blinky.j)
          && map[ghosts.blinky.i][ghosts.blinky.j + 1] === 0) {
          ghosts.blinky.j++;
        }
        else if ((pacman.i === ghosts.blinky.i && pacman.j > ghosts.blinky.j)
          && map[ghosts.blinky.i][ghosts.blinky.j - 1] === 0) {
          ghosts.blinky.j--;
        }

        else {
          if ((pacman.i < ghosts.blinky.i && pacman.j < ghosts.blinky.j)) {

            if (map[ghosts.blinky.i + 1][ghosts.blinky.j] === 0) {
              ghosts.blinky.i++;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j + 1] === 0) {
              ghosts.blinky.j++;
            }

          }

          else if ((pacman.i > ghosts.blinky.i && pacman.j > ghosts.blinky.j)) {

            if (map[ghosts.blinky.i - 1][ghosts.blinky.j] === 0) {
              ghosts.blinky.i--;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j - 1] === 0) {
              ghosts.blinky.j--;
            }

          }

          else if ((pacman.i < ghosts.blinky.i && pacman.j > ghosts.blinky.j)) {

            if (map[ghosts.blinky.i + 1][ghosts.blinky.j] === 0) {
              ghosts.blinky.i++;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j - 1] === 0) {
              ghosts.blinky.j--;
            }

          }

          else if ((pacman.i > ghosts.blinky.i && pacman.j < ghosts.blinky.j)) {

            if (map[ghosts.blinky.i - 1][ghosts.blinky.j] === 0) {
              ghosts.blinky.i--;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j + 1] === 0) {
              ghosts.blinky.j++;
            }

          }

        }
      }
    },
    behavior: () => {
      if (!ghosts.blinky.start) {
        //Viaggetto in alto a dx durante lo start
        if (ghosts.blinky.i !== 1 || ghosts.blinky.j !== 19) {
          if ((map[ghosts.blinky.i - 1][ghosts.blinky.j]) === 0)
            ghosts.blinky.i--;
          else if ((map[ghosts.blinky.i][ghosts.blinky.j + 1]) === 0)
            ghosts.blinky.j++;
        }
        else ghosts.blinky.start = true;
      } else {
        //insegue pacman

        if ((pacman.i > ghosts.blinky.i && pacman.j === ghosts.blinky.j)
          && map[ghosts.blinky.i + 1][ghosts.blinky.j] % 2 == 0) {
          ghosts.blinky.i++;
        }
        else if ((pacman.i < ghosts.blinky.i && pacman.j === ghosts.blinky.j)
          && map[ghosts.blinky.i - 1][ghosts.blinky.j] % 2 == 0) {
          ghosts.blinky.i--;
        }

        else if ((pacman.i === ghosts.blinky.i && pacman.j > ghosts.blinky.j)
          && map[ghosts.blinky.i][ghosts.blinky.j + 1] % 2 == 0) {
          ghosts.blinky.j++;
        }
        else if ((pacman.i === ghosts.blinky.i && pacman.j < ghosts.blinky.j)
          && map[ghosts.blinky.i][ghosts.blinky.j - 1] % 2 == 0) {
          ghosts.blinky.j--;
        }

        else {
          if ((pacman.i > ghosts.blinky.i && pacman.j > ghosts.blinky.j)) {

            if (map[ghosts.blinky.i + 1][ghosts.blinky.j] % 2 == 0) {
              ghosts.blinky.i++;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j + 1] % 2 == 0) {
              ghosts.blinky.j++;
            }

          }

          else if ((pacman.i < ghosts.blinky.i && pacman.j < ghosts.blinky.j)) {

            if (map[ghosts.blinky.i - 1][ghosts.blinky.j] % 2 == 0) {
              ghosts.blinky.i--;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j - 1] % 2 == 0) {
              ghosts.blinky.j--;
            }

          }

          else if ((pacman.i > ghosts.blinky.i && pacman.j < ghosts.blinky.j)) {

            if (map[ghosts.blinky.i + 1][ghosts.blinky.j] % 2 == 0) {
              ghosts.blinky.i++;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j - 1] % 2 == 0) {
              ghosts.blinky.j--;
            }

          }

          else if ((pacman.i < ghosts.blinky.i && pacman.j > ghosts.blinky.j)) {

            if (map[ghosts.blinky.i - 1][ghosts.blinky.j] % 2 == 0) {
              ghosts.blinky.i--;
            }
            else if (map[ghosts.blinky.i][ghosts.blinky.j + 1] % 2 == 0) {
              ghosts.blinky.j++;
            }

          }

        }
      }
      if (pacman.i === ghosts.blinky.i && pacman.j === ghosts.blinky.j) {
        reset();
        life.vite--
      }
    }
  },
  //Azzurro
  inky: {
    i: 12,
    j: 9,
    check: false,
    start: false,
    img: new Image(),
    draw: (() => {
      if (ghosts.inky.check)
        ctx.drawImage(ghosts.inky.img, ghosts.inky.j * 35, ghosts.inky.i * 35, 35, 35);
    }),
    //BlueGhost
    blueGhost: {
      check: false,
      img: new Image(),
      draw: (() => {
        if (ghosts.inky.blueGhost.check)
          ctx.drawImage(ghosts.inky.blueGhost.img, ghosts.inky.j * 35, ghosts.inky.i * 35, 35, 35);
      }),
      behavior: () => {
        if (pacman.i === ghosts.inky.i && pacman.j === ghosts.inky.j) {
          ghosts.inky.i = 12;
          ghosts.inky.j = 9;
          score += 400;
          ghosts.inky.start = false;
        }

        if ((pacman.i < ghosts.inky.i && pacman.j === ghosts.inky.j)
          && map[ghosts.inky.i + 1][ghosts.inky.j] === 0) {
          ghosts.inky.i++;
        }
        else if ((pacman.i > ghosts.inky.i && pacman.j === ghosts.inky.j)
          && map[ghosts.inky.i - 1][ghosts.inky.j] === 0) {
          ghosts.inky.i--;
        }

        else if ((pacman.i === ghosts.inky.i && pacman.j < ghosts.inky.j)
          && map[ghosts.inky.i][ghosts.inky.j + 1] === 0) {
          ghosts.inky.j++;
        }
        else if ((pacman.i === ghosts.inky.i && pacman.j > ghosts.inky.j)
          && map[ghosts.inky.i][ghosts.inky.j - 1] === 0) {
          ghosts.inky.j--;
        }

        else {
          if ((pacman.i < ghosts.inky.i && pacman.j < ghosts.inky.j)) {

            if (map[ghosts.inky.i + 1][ghosts.inky.j] === 0) {
              ghosts.inky.i++;
            }
            else if (map[ghosts.inky.i][ghosts.inky.j + 1] === 0) {
              ghosts.inky.j++;
            }

          }

          else if ((pacman.i > ghosts.inky.i && pacman.j > ghosts.inky.j)) {

            if (map[ghosts.inky.i - 1][ghosts.inky.j] === 0) {
              ghosts.inky.i--;
            }
            else if (map[ghosts.inky.i][ghosts.inky.j - 1] === 0) {
              ghosts.inky.j--;
            }

          }

          else if ((pacman.i < ghosts.inky.i && pacman.j > ghosts.inky.j)) {

            if (map[ghosts.inky.i + 1][ghosts.inky.j] === 0) {
              ghosts.inky.i++;
            }
            else if (map[ghosts.inky.i][ghosts.inky.j - 1] === 0) {
              ghosts.inky.j--;
            }

          }

          else if ((pacman.i > ghosts.inky.i && pacman.j < ghosts.inky.j)) {

            if (map[ghosts.inky.i - 1][ghosts.inky.j] === 0) {
              ghosts.inky.i--;
            }
            else if (map[ghosts.inky.i][ghosts.inky.j + 1] === 0) {
              ghosts.inky.j++;
            }

          }

        }
      }
    },
    behavior: () => {
      if (!ghosts.inky.start) {
        if (ghosts.inky.i !== 6 || ghosts.inky.j !== 11) {

          if ((map[ghosts.inky.i - 1][ghosts.inky.j]) % 2 === 0)
            ghosts.inky.i--;
          else if ((map[ghosts.inky.i][ghosts.inky.j + 1]) % 2 === 0)
            ghosts.inky.j++;
        }
        else ghosts.inky.start = true;
      } else {

        let targI = pacman.i + (pacman.i - ghosts.blinky.i);
        let targJ = pacman.j + (pacman.j - ghosts.blinky.j);

        let diffI = targI - ghosts.inky.i;
        let diffJ = targJ - ghosts.inky.j;
        if (Math.abs(diffI) > Math.abs(diffJ)) {

          if (diffI > 0 && map[ghosts.inky.i + 1][ghosts.inky.j] === 0) {
            ghosts.inky.i++;
          }
          else if (diffI < 0 && map[ghosts.inky.i - 1][ghosts.inky.j] === 0) {
            ghosts.inky.i--;
          }
          else if (diffJ > 0 && map[ghosts.inky.i][ghosts.inky.j + 1] === 0) {
            ghosts.inky.j++;
          }
          else if (diffJ < 0 && map[ghosts.inky.i][ghosts.inky.j - 1] === 0) {
            ghosts.inky.j--;
          }
        }
        else {
          if (diffJ > 0 && map[ghosts.inky.i][ghosts.inky.j + 1] === 0) {
            ghosts.inky.j++;
          }
          else if (diffJ < 0 && map[ghosts.inky.i][ghosts.inky.j - 1] === 0) {
            ghosts.inky.j--;
          }
          else if (diffI > 0 && map[ghosts.inky.i + 1][ghosts.inky.j] === 0) {
            ghosts.inky.i++;
          }
          else if (diffI < 0 && map[ghosts.inky.i - 1][ghosts.inky.j] === 0) {
            ghosts.inky.i--;
          }
        }
        if (pacman.i === ghosts.inky.i && pacman.j === ghosts.inky.j) {
          reset();
          life.vite--
        }
      }

    }
  },
  //Rosa
  pinky: {
    i: 12,
    j: 10,
    check: false,
    start: false,
    img: new Image(),
    draw: (() => {
      if (ghosts.pinky.check)
        ctx.drawImage(ghosts.pinky.img, ghosts.pinky.j * 35, ghosts.pinky.i * 35, 35, 35);
    }),
    //BlueGhost
    blueGhost: {
      check: false,
      img: new Image(),
      draw: (() => {
        if (ghosts.pinky.blueGhost.check)
          ctx.drawImage(ghosts.pinky.blueGhost.img, ghosts.pinky.j * 35, ghosts.pinky.i * 35, 35, 35);
      }),
      behavior: () => {
        if (pacman.i === ghosts.pinky.i && pacman.j === ghosts.pinky.j) {
          ghosts.pinky.i = 12;
          ghosts.pinky.j = 10;
          score += 400;
        }
        if ((pacman.i < ghosts.pinky.i && pacman.j === ghosts.pinky.j)
          && map[ghosts.pinky.i + 1][ghosts.pinky.j] % 2 == 0) {
          ghosts.pinky.i++;
        }
        else if ((pacman.i > ghosts.pinky.i && pacman.j === ghosts.pinky.j)
          && map[ghosts.pinky.i - 1][ghosts.pinky.j] % 2 == 0) {
          ghosts.pinky.i--;
        }

        else if ((pacman.i === ghosts.pinky.i && pacman.j < ghosts.pinky.j)
          && map[ghosts.pinky.i][ghosts.pinky.j + 1] % 2 == 0) {
          ghosts.pinky.j++;
        }
        else if ((pacman.i === ghosts.pinky.i && pacman.j > ghosts.pinky.j)
          && map[ghosts.pinky.i][ghosts.pinky.j - 1] % 2 == 0) {
          ghosts.pinky.j--;
        }

        else {
          if ((pacman.i < ghosts.pinky.i && pacman.j < ghosts.pinky.j)) {

            if (map[ghosts.pinky.i + 1][ghosts.pinky.j] % 2 == 0) {
              ghosts.pinky.i++;
            }
            else if (map[ghosts.pinky.i][ghosts.pinky.j + 1] % 2 == 0) {
              ghosts.pinky.j++;
            }

          }

          else if ((pacman.i > ghosts.pinky.i && pacman.j > ghosts.pinky.j)) {

            if (map[ghosts.pinky.i - 1][ghosts.pinky.j] % 2 == 0) {
              ghosts.pinky.i--;
            }
            else if (map[ghosts.pinky.i][ghosts.pinky.j - 1] % 2 == 0) {
              ghosts.pinky.j--;
            }

          }

          else if ((pacman.i < ghosts.pinky.i && pacman.j > ghosts.pinky.j)) {

            if (map[ghosts.pinky.i + 1][ghosts.pinky.j] % 2 == 0) {
              ghosts.pinky.i++;
            }
            else if (map[ghosts.pinky.i][ghosts.pinky.j - 1] % 2 == 0) {
              ghosts.pinky.j--;
            }

          }

          else if ((pacman.i > ghosts.pinky.i && pacman.j < ghosts.pinky.j)) {

            if (map[ghosts.pinky.i - 1][ghosts.pinky.j] % 2 == 0) {
              ghosts.pinky.i--;
            }
            else if (map[ghosts.pinky.i][ghosts.pinky.j + 1] % 2 == 0) {
              ghosts.pinky.j++;
            }

          }

        }
      }
    },
    behavior: () => {
      if (!ghosts.pinky.start) {
        if (ghosts.pinky.i != 8) {
          if (map[ghosts.pinky.i - 1][ghosts.pinky.j] % 2 === 0) {
            ghosts.pinky.i--;
          }
        } else ghosts.pinky.start = true;
      } else {
        let targI = 0, targJ = 0;
        switch (actualFunction) {
          case pacmanUp:
            targI = pacman.i + 4;
            targJ = pacman.j
            break;
          case pacmanDown:
            targI = pacman.i - 4;
            targJ = pacman.j
            break;
          case pacmanLeft:
            targI = pacman.i;
            targJ = pacman.j - 4;
            break;
          case pacmanRight:
            targI = pacman.i;
            targJ = pacman.j + 4;
            break;
        }
        targI = Math.max(0, Math.min(map.length - 1, targI));
        targJ = Math.max(0, Math.min(map[0].length - 1, targJ));
        let diffI = targI - ghosts.pinky.i;
        let diffJ = targJ - ghosts.pinky.j;
        if (Math.abs(diffI) > Math.abs(diffJ)) {
          if (diffI > 0 && map[ghosts.pinky.i + 1][ghosts.pinky.j] === 0) {
            ghosts.pinky.i++;
          }
          else if (diffI < 0 && map[ghosts.pinky.i - 1][ghosts.pinky.j] === 0) {
            ghosts.inky.i--;
          }
          else if (diffJ > 0 && map[ghosts.pinky.i][ghosts.pinky.j + 1] === 0) {
            ghosts.pinky.j++;
          }
          else if (diffJ < 0 && map[ghosts.pinky.i][ghosts.pinky.j - 1] === 0) {
            ghosts.pinky.j--;
          }
        }
        else {
          if (diffJ > 0 && map[ghosts.pinky.i][ghosts.pinky.j + 1] === 0) {
            ghosts.pinky.j++;
          }
          else if (diffJ < 0 && map[ghosts.pinky.i][ghosts.pinky.j - 1] === 0) {
            ghosts.pinky.j--;
          }
          else if (diffI > 0 && map[ghosts.pinky.i + 1][ghosts.pinky.j] === 0) {
            ghosts.pinky.i++;
          }
          else if (diffI < 0 && map[ghosts.pinky.i - 1][ghosts.pinky.j] === 0) {
            ghosts.pinky.i--;
          }
        }

      }
      if (pacman.i === ghosts.pinky.i && pacman.j === ghosts.pinky.j) {
        reset();
        life.vite--
      }
    }
  },
  //Arancione
  clyde: {
    i: 12,
    j: 11,
    check: false,
    start: false,
    img: new Image(),
    draw: (() => {
      if (ghosts.clyde.check)
        ctx.drawImage(ghosts.clyde.img, ghosts.clyde.j * 35, ghosts.clyde.i * 35, 35, 35);
    }),
    //BlueGhost
    blueGhost: {
      check: false,
      img: new Image(),
      draw: (() => {
        if (ghosts.clyde.blueGhost.check)
          ctx.drawImage(ghosts.clyde.blueGhost.img, ghosts.clyde.j * 35, ghosts.clyde.i * 35, 35, 35);
      }),
      behavior: () => {
        //let ray = 5;
        //respawn del fantasmino
        if (pacman.i === ghosts.clyde.i && pacman.j === ghosts.clyde.j) {
          ghosts.clyde.i = 12;
          ghosts.clyde.j = 11;
          score += 400;
        }

        if ((pacman.i < ghosts.clyde.i && pacman.j === ghosts.clyde.j)
          && map[ghosts.clyde.i + 1][ghosts.clyde.j] % 2 == 0) {
          ghosts.clyde.i++;
        }
        else if ((pacman.i > ghosts.clyde.i && pacman.j === ghosts.clyde.j)
          && map[ghosts.clyde.i - 1][ghosts.clyde.j] % 2 == 0) {
          ghosts.clyde.i--;
        }

        else if ((pacman.i === ghosts.clyde.i && pacman.j < ghosts.clyde.j)
          && map[ghosts.clyde.i][ghosts.clyde.j + 1] % 2 == 0) {
          ghosts.clyde.j++;
        }
        else if ((pacman.i === ghosts.clyde.i && pacman.j > ghosts.clyde.j)
          && map[ghosts.clyde.i][ghosts.clyde.j - 1] % 2 == 0) {
          ghosts.clyde.j--;
        }

        else {
          if ((pacman.i < ghosts.clyde.i && pacman.j < ghosts.clyde.j)) {

            if (map[ghosts.clyde.i + 1][ghosts.clyde.j] % 2 == 0) {
              ghosts.clyde.i++;
            }
            else if (map[ghosts.clyde.i][ghosts.clyde.j + 1] % 2 == 0) {
              ghosts.clyde.j++;
            }

          }

          else if ((pacman.i > ghosts.clyde.i && pacman.j > ghosts.clyde.j)) {

            if (map[ghosts.clyde.i - 1][ghosts.clyde.j] % 2 == 0) {
              ghosts.clyde.i--;
            }
            else if (map[ghosts.clyde.i][ghosts.clyde.j - 1] % 2 == 0) {
              ghosts.clyde.j--;
            }

          }

          else if ((pacman.i < ghosts.clyde.i && pacman.j > ghosts.clyde.j)) {

            if (map[ghosts.clyde.i + 1][ghosts.clyde.j] % 2 == 0) {
              ghosts.clyde.i++;
            }
            else if (map[ghosts.clyde.i][ghosts.clyde.j - 1] % 2 == 0) {
              ghosts.clyde.j--;
            }

          }

          else if ((pacman.i > ghosts.clyde.i && pacman.j < ghosts.clyde.j)) {

            if (map[ghosts.clyde.i - 1][ghosts.clyde.j] % 2 == 0) {
              ghosts.clyde.i--;
            }
            else if (map[ghosts.clyde.i][ghosts.clyde.j + 1] % 2 == 0) {
              ghosts.clyde.j++;
            }

          }

        }
      }
    },
    behavior: () => {

      //uscita dalla cella 
      if (!ghosts.clyde.start) {

        if (ghosts.clyde.i !== 8 || ghosts.clyde.j !== 9) {
          if ((map[ghosts.clyde.i - 1][ghosts.clyde.j]) % 2 == 0)
            ghosts.clyde.i--;
          else if ((map[ghosts.clyde.i][ghosts.clyde.j - 1]) % 2 == 0)
            ghosts.clyde.j--;
        } else ghosts.clyde.start = true;
      } else {

        //distasnza della celle
        let ray = 8;

        //variabile per il calcolo della distanza tra Clyde e PacMan
        const distance = Math.sqrt(Math.pow(pacman.i - ghosts.clyde.i, 2) + Math.pow(pacman.j + ghosts.clyde.j, 2));


        if (distance <= ray) {
          //insegue pacman come Blinky

          if ((pacman.i > ghosts.clyde.i && pacman.j === ghosts.clyde.j)
            && map[ghosts.clyde.i + 1][ghosts.clyde.j] === 0) {
            ghosts.clyde.i++;
          }
          else if ((pacman.i < ghosts.clyde.i && pacman.j === ghosts.clyde.j)
            && map[ghosts.clyde.i - 1][ghosts.clyde.j] === 0) {
            ghosts.clyde.i--;
          }

          else if ((pacman.i === ghosts.clyde.i && pacman.j > ghosts.clyde.j)
            && map[ghosts.clyde.i][ghosts.clyde.j + 1] === 0) {
            ghosts.clyde.j++;
          }
          else if ((pacman.i === ghosts.clyde.i && pacman.j < ghosts.clyde.j)
            && map[ghosts.clyde.i][ghosts.clyde.j - 1] === 0) {
            ghosts.clyde.j--;
          }

          else {
            if ((pacman.i > ghosts.clyde.i && pacman.j > ghosts.clyde.j)) {

              if (map[ghosts.clyde.i + 1][ghosts.clyde.j] === 0) {
                ghosts.clyde.i++;
              }
              else if (map[ghosts.clyde.i][ghosts.clyde.j + 1] === 0) {
                ghosts.clyde.j++;
              }

            }

            else if ((pacman.i < ghosts.clyde.i && pacman.j < ghosts.clyde.j)) {

              if (map[ghosts.clyde.i - 1][ghosts.clyde.j] === 0) {
                ghosts.clyde.i--;
              }
              else if (map[ghosts.clyde.i][ghosts.clyde.j - 1] === 0) {
                ghosts.clyde.j--;
              }

            }

            else if ((pacman.i > ghosts.clyde.i && pacman.j < ghosts.clyde.j)) {

              if (map[ghosts.clyde.i + 1][ghosts.clyde.j] === 0) {
                ghosts.clyde.i++;
              }
              else if (map[ghosts.clyde.i][ghosts.clyde.j - 1] === 0) {
                ghosts.clyde.j--;
              }

            }

            else if ((pacman.i < ghosts.clyde.i && pacman.j > ghosts.clyde.j)) {

              if (map[ghosts.clyde.i - 1][ghosts.clyde.j] === 0) {
                ghosts.clyde.i--;
              }
              else if (map[ghosts.clyde.i][ghosts.clyde.j + 1] === 0) {
                ghosts.clyde.j++;
              }

            }

          }
        } else {
          //Viaggetto in basso a sx se il pacman e dentro l'area della 8 caselle
          if (ghosts.clyde.i !== 22 || ghosts.clyde.j !== 1) {
            if ((map[ghosts.clyde.i + 1][ghosts.clyde.j]) === 0)
              ghosts.clyde.i++;
            else if ((map[ghosts.clyde.i][ghosts.clyde.j - 1]) === 0)
              ghosts.clyde.j--;
          }
        }
      }
      if (pacman.i === ghosts.clyde.i && pacman.j === ghosts.clyde.j) {
        reset();
        life.vite--
      }
    }
  }
}
{
  //Rosso
  ghosts.blinky.img.onload = function() {
    ghosts.blinky.check = true;
  }
  ghosts.blinky.img.src = "./assets/Ghost/Blinky.png";

  //Azzurro
  ghosts.inky.img.onload = function() {
    ghosts.inky.check = true;
  }
  ghosts.inky.img.src = "./assets/Ghost/Inky.png";

  //Rosa
  ghosts.pinky.img.onload = function() {
    ghosts.pinky.check = true;
  }
  ghosts.pinky.img.src = "./assets/Ghost/Pinky.png";

  //Arancione
  ghosts.clyde.img.onload = function() {
    ghosts.clyde.check = true;
  }
  ghosts.clyde.img.src = "./assets/Ghost/Clyde.png";
}

//BLUEGHOST
{
  //Rosso-blueGhost
  ghosts.blinky.blueGhost.img.onload = function() {
    ghosts.blinky.blueGhost.check = true;
  }
  ghosts.blinky.blueGhost.img.src = "./assets/Ghost/BlueGhost.png";

  //Azzuro-blueGhost
  ghosts.inky.blueGhost.img.onload = function() {
    ghosts.inky.blueGhost.check = true;
  }
  ghosts.inky.blueGhost.img.src = "./assets/Ghost/BlueGhost.png";

  //Rosa-blueGhost
  ghosts.pinky.blueGhost.img.onload = function() {
    ghosts.pinky.blueGhost.check = true;
  }
  ghosts.pinky.blueGhost.img.src = "./assets/Ghost/BlueGhost.png";

  //Arancione-blueGhost
  ghosts.clyde.blueGhost.img.src = "./assets/Ghost/BlueGhost.png";
  ghosts.clyde.blueGhost.img.onload = function() {
    ghosts.clyde.blueGhost.check = true;
  }
}



//PACMAN

/*
 * Il numero 35 che viene utilizzato per disegnare il Pac-Man è una 
 * cella della mappa (è come se fosse filed.wallSize)
 */
const pacman = {
  diam: 35,
  i: 14,
  j: 10,
  //SOPRA
  up: () => {
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    const path = "./assets/UP-PacMan/";
    const loaded = [];
    const imgs = [];
    let actualImage = 0;

    for (let i = 0; i < 4; i++) {
      loaded.push(false);
      imgs.push(new Image());
    }
    for (let i = 0; i < 4; i++) imgs[i].onload = () => loaded[i] = true;

    imgs[0].src = path + "1.png";
    imgs[1].src = path + "2.png";
    imgs[2].src = path + "3.png";

    return () => {
      if (loaded[actualImage]) {
        if (map[pacman.i - 1][pacman.j] == 0) pacman.i--;
        ctx.drawImage(imgs[actualImage], pacman.j * pacman.diam, pacman.i * pacman.diam, pacman.diam, pacman.diam);
        actualImage++;
        if (actualImage === 3) actualImage = 0;

      }
    }
  },
  //SOTTO 
  down: () => {
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    const path = "./assets/DOWN-PacMan/";
    const loaded = [];
    const imgs = [];
    let actualImage = 0;

    for (let i = 0; i < 4; i++) {
      loaded.push(false);
      imgs.push(new Image());
    }
    for (let i = 0; i < 4; i++) imgs[i].onload = () => loaded[i] = true;

    imgs[0].src = path + "1.png";
    imgs[1].src = path + "2.png";
    imgs[2].src = path + "3.png";

    return () => {
      if (loaded[actualImage]) {
        if (map[pacman.i + 1][pacman.j] === 0) pacman.i++;
        ctx.drawImage(imgs[actualImage], pacman.j * pacman.diam, pacman.i * pacman.diam, pacman.diam, pacman.diam);
        actualImage++;
        if (actualImage === 3) actualImage = 0;

      }
    }
  },
  //SINITRA
  left: () => {
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    const path = "./assets/LEFT-PacMan/";
    const loaded = [];
    const imgs = [];
    let actualImage = 0;

    for (let i = 0; i < 4; i++) {
      loaded.push(false);
      imgs.push(new Image());
    }
    for (let i = 0; i < 4; i++) imgs[i].onload = () => loaded[i] = true;

    imgs[0].src = path + "1.png";
    imgs[1].src = path + "2.png";
    imgs[2].src = path + "3.png";

    return () => {
      if (loaded[actualImage]) {
        if (map[pacman.i][pacman.j - 1] == 0) pacman.j--;
        ctx.drawImage(imgs[actualImage], pacman.j * pacman.diam, pacman.i * pacman.diam, pacman.diam, pacman.diam);
        actualImage++;
        if (actualImage === 3) actualImage = 0;
      }
    }
  },
  //DESTRA
  right: () => {
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    const path = "./assets/RIGHT-PacMan/";
    const loaded = [];
    const imgs = [];
    let actualImage = 0;

    for (let i = 0; i < 3; i++) {
      loaded.push(false);
      imgs.push(new Image());
    }
    for (let i = 0; i < imgs.length; i++) imgs[i].onload = () => loaded[i] = true;

    imgs[0].src = path + "1.png";
    imgs[1].src = path + "2.png";
    imgs[2].src = path + "3.png";

    return () => {
      if (loaded[actualImage]) {
        if (map[pacman.i][pacman.j + 1] == 0) pacman.j++;
        ctx.drawImage(imgs[actualImage], pacman.j * pacman.diam, pacman.i * pacman.diam, pacman.diam, pacman.diam);
        actualImage++;
        if (actualImage === 3) actualImage = 0;
      }
    }
  },
  eat: () => {
    //Mangiare oggetti points
    let index = -1;
    const CELLS = 21;
    let x = pacman.i;
    let y = pacman.j;
    const pointKey = Object.keys(points);
    if (eaten === target) {
      finished = true
      newObj = true;
      if (level <= MAX) level++;
    };
    if (!finished) {
      for (let i = 0; i < pointsMap.length; i++) {
        for (let j = 0; j < CELLS; j++) {
          switch (pointsMap[x][y]) {
            case 0: //balls
              pointsMap[x][y] = -1;
              index = 0;
              eaten++;
              break;
            case 3: //powerup
              pointsMap[x][y] = -1;
              index = 1;
              scared = true;
              previousTime = Date.now();
              break;
            case 4: //Cherry
              pointsMap[x][y] = -1;
              index = 2;
              break;
            case 5: //Fragola
              pointsMap[x][y] = -1;
              index = 3;
              break;
            case 6: //Arancia
              pointsMap[x][y] = -1;
              index = 4;
              break;
            case 7: //Mela
              pointsMap[x][y] = -1;
              index = 5;
              break;
            case 8: //Uva
              pointsMap[x][y] = -1;
              index = 6;
              break;
            case 9: //Galaxian
              pointsMap[x][y] = -1;
              index = 7;
              break;
            case 10: //Campana
              pointsMap[x][y] = -1;
              index = 8;
              break;
            case 11: //Chiave
              pointsMap[x][y] = -1;
              index = 9;
              break;
            default:
              index = -1;
          }
          if (index != -1) break;
        }
        if (index != -1) break;
      }
      if (index != -1) {
        score += points[pointKey[index]].point;
        lvlScore += points[pointKey[index]].point;
      }
    }
  },
  start: () => {
    //POsizione pac iniziale
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    const path = "./assets/RIGHT-PacMan/";
    const loaded = [];
    const imgs = [];
    let actualImage = 0;

    for (let i = 0; i < 3; i++) {
      loaded.push(false);
      imgs.push(new Image());
    }
    for (let i = 0; i < imgs.length; i++) imgs[i].onload = () => loaded[i] = true;

    imgs[2].src = path + "1.png";
    imgs[1].src = path + "2.png";
    imgs[0].src = path + "3.png";

    return () => {
      if (loaded[actualImage]) {
        ctx.drawImage(imgs[actualImage], 10 * pacman.diam, 14 * pacman.diam, pacman.diam, pacman.diam);
        actualImage++;
        if (actualImage === 3) actualImage = 0;
      }
    }
  }
}

//CAMPO
const field = {
  wallSize: 35,
  /*
   1-->ostacoli/muri
   0 --> spazi vuoti
   */
  draw: () => {
    ctx.lineWidth = 5;
    ctx.fillStyle = "#0000FF";
    const CELLS = 21;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < CELLS; j++) {
        if (map[i][j] === 1) {
          ctx.fillRect(j * field.wallSize, i * field.wallSize, field.wallSize, field.wallSize);
        }
      }
    }
  }
}


const pacmanUp = pacman.up();
const pacmanDown = pacman.down();
const pacmanLeft = pacman.left();
const pacmanRight = pacman.right();
const pacmanStart = pacman.start();
const lives = life.heart();
let actualFunction;

document.onkeydown = (e) => {
  if (e.keyCode === 37 || e.keyCode === 65) { // LEFT
    actualFunction = pacmanLeft;
  }
  else if (e.keyCode === 38 || e.keyCode === 87) { // UP
    actualFunction = pacmanUp;
  }
  else if (e.keyCode === 39 || e.keyCode === 68) { // RIGHT
    actualFunction = pacmanRight;
  }
  else if (e.keyCode === 40 || e.keyCode === 83) { // DOWN
    actualFunction = pacmanDown;
  }
}

let frames = 0;
const update = 30;

const pts = Object.keys(points);
let index = 2;
let newObj = false;
let drawn = true;

function main() {
  if (screen[0]) {
    if (level <= MAX) {
      if (!finished) {
        if (frames >= 60) frames = 0;
        if (frames % update === 0) {
          ctx.clearRect(0, 0, width, height);
          lives();
          //Score e Lvl corrente
          scoreBoard.innerHTML = "<h3 class=\"head\">Score: " + score + "</h3>";
          countLevel.innerHTML = "<h3 class=\"head\">Level: " + level + "</h3>";
          //Disegno mappa
          field.draw();
          //Disegno ball 
          points.balls.draw();
          //Disegno powerUps
          points.powerup.draw(frames);
          for (let i = 2; i < pts.length; i++) {
            if (lvlScore >= points[pts[index]].achieve) {
              if (pointsMap[14][10] === -1 && drawn) {
                pointsMap[14][10] = index + 2;
                drawn = false;
              }
              if (pointsMap[14][10] != -1 && pointsMap[14][10] != 0) {
                points[pts[index]].draw();
              }
              if (index < pts.length - 1 && (level - 1) % 2 === 0 && newObj) {
                index++;
                newObj = false;
              }
            }
          }
          if (!actualFunction) {
            pacmanStart();
            Object.keys(ghosts).forEach((e) => ghosts[e].draw());
          }
          else {
            actualFunction();
            pacman.eat();
            if (!scared)
              Object.keys(ghosts).forEach((e) => {
                ghosts[e].draw();
                ghosts[e].behavior();
              });
            else {
              points.powerup.ability();
              switch (level) {
                case 1:
                  if (Date.now() - previousTime > 6000) scared = false;
                  break;
                case 2, 3, 4:
                  if (Date.now() - previousTime > 5000) scared = false;
                  break;
                case 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20:
                  if (Date.now() - previousTime > 4000) scared = false;
                  break;
                default:
                  if (Date.now() - previousTime > 3000) scared = false;
              }
            }
          }
        }
        frames++;
      } else {
        if (life.vite === 0) {
          ctx.fillStyle = "red";
          ctx.lineWidth = "2";
          ctx.font = "80px serif";
          ctx.fillText("Game Over", width / 3 - width / 8, height / 2);
          ctx.fill();
          setTimeout(() => {
            screen[0] = false;
            screen[1] = true;
            reset();
          }, 2000);
        }
      }
    } else {
      //Superato 256 lvl
      ctx.fillStyle = "green";
      ctx.lineWidth = "2";
      ctx.font = "80px serif";
      ctx.fillText("You won!", width / 3 - width / 8, height / 2);
      ctx.fill();
      setTimeout(() => {
        screen[0] = false;
        screen[1] = true;
        reset();
      }, 2000);
    }
  }
  else if (screen[1]) {
    if (!username) {
      hideItem(playDiv);
      showItem(inputForm);
    }
    else
      for (let i = 0; i < screen.length; i++)
        screen[i] = false;
  }
  else {
    let again;
    if (!screen[2]) {
      hideItem(playDiv);
      hideItem(inputForm);
      showItem(hallOfFame);
      let rows = "";
      rows += templateStart;
      userScoreBoard.sort((a, b) => b.points - a.points);
      userScoreBoard.forEach((e, index) => {
        if (index < 5)
          rows += template.replace("%position", index + 1)
            .replace("%username", e.name)
            .replace("%score", e.points);
      });
      rows += templateEnd;
      hallOfFame.innerHTML = rows;
      screen[2] = true;
    }
    else {
      again = document.getElementById("playAgain");
      if (again)
        again.onclick = () => {
          location.reload();
        }
    }
  }
}
setInterval(main, 0.06);

//funzione show
function showItem(obj) {
  obj.classList.add("show");
  obj.classList.remove("hidden");
}

//funzione hidden
function hideItem(obj) {
  obj.classList.remove("show");
  obj.classList.add("hidden");
}


button.onclick = () => {
  username = usernameInput.value;
  if (username != null && username != "") {
    if (!userScoreBoard.some(user => user.name === username)) {
      localStorage.setItem("username", username);
      userScoreBoard.push({
        name: username,
        points: score
      });
      score = 0;
      set();
    }
    else {
      usernameInput.value = "";
      alert("Username già esistente, sceglierne uno diverso!");
      return;
    }
    for (let i = 0; i < screen.length; i++)
      screen[i] = false;
    screen[1] = true;
  }
  else {
    usernameInput.value = "";
    alert("Username non valido!");
    return;
  }
}

const get = () => {
  fetch(
    urlGet,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "key": token
      },
      body: JSON.stringify({
        key: key
      })
    }
  )
    .then(respone => respone.json())
    .then(data => {
      userScoreBoard = JSON.parse(data.result);
      main();
    })
};

const set = () => {
  fetch(
    urlPost,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "key": token
      },
      body: JSON.stringify({
        key: key,
        value: JSON.stringify(userScoreBoard)
      })
    }
  )
};

get();