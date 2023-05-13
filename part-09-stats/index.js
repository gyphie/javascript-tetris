// step 09
import { Game } from "./tetris/game.js";

const gameBoardCanvas = document.getElementById("gameBoard");
const previewCanvas = document.getElementById("preview");

const tetrisSettings = {
  gameBoard: {
    canvas: gameBoardCanvas.getContext("2d"),
    width: 10,
    height: 20,
    blockSize: 80,
    backgroundColor: "#eeeeee"
  },
  preview: {
    canvas: previewCanvas.getContext("2d"),
    width: 4,
    height: 4,
    blockSize: 10,
    backgroundColor: "#ffffff"
  },
  statsChanged: handleStatsChanged
};

const tetris = new Game(tetrisSettings);

document.addEventListener("keydown", handleGameKey);

document.getElementById("btnRotate").addEventListener("click", () => tetris.rotatePiece());
document.getElementById("btnDown").addEventListener("click", () => tetris.moveDown());
document.getElementById("btnLeft").addEventListener("click", () => tetris.moveLeft());
document.getElementById("btnRight").addEventListener("click", () => tetris.moveRight());
document.getElementById("btnDrop").addEventListener("click", () => tetris.dropPiece());
document.getElementById("btnStart").addEventListener("click", () => tetris.start());


function handleStatsChanged(stats) {
  document.getElementById("score").innerText = stats.score;
  document.getElementById("level").innerText = stats.level;
  document.getElementById("lines").innerText = stats.lines;
}

function handleGameKey(event) {
  if (event.keyCode === KEY.UP) {
    tetris.rotatePiece();
  } else if (event.keyCode === KEY.DOWN) {
    tetris.moveDown();
  } else if (event.keyCode === KEY.LEFT) {
    tetris.moveLeft();
  } else if (event.keyCode === KEY.RIGHT) {
    tetris.moveRight();
  } else if (event.keyCode === KEY.SPACE) {
    tetris.dropPiece();
  } else {
    return true;
  }

  event.preventDefault();
  return false;
}

const KEY = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};
