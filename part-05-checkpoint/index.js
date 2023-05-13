// step 05
import { Game } from "./tetris/game.js";

const gameBoardCanvas = document.getElementById("gameBoard");
const previewCanvas = document.getElementById("preview");

const tetris = new Game(gameBoardCanvas.getContext("2d"), previewCanvas.getContext("2d"));

document.addEventListener("keydown", handleGameKey);

document.getElementById("btnRotate").addEventListener("click", () => tetris.rotatePiece());
document.getElementById("btnDown").addEventListener("click", () => tetris.moveDown());
document.getElementById("btnLeft").addEventListener("click", () => tetris.moveLeft());
document.getElementById("btnRight").addEventListener("click", () => tetris.moveRight());
document.getElementById("btnDrop").addEventListener("click", () => tetris.dropPiece());
document.getElementById("btnStart").addEventListener("click", () => tetris.start());


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
