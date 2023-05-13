// step 02
import { Game } from "./tetris/game.js";

const gameBoardCanvas = document.getElementById("gameBoard");
const previewCanvas = document.getElementById("preview");

const tetris = new Game(gameBoardCanvas.getContext("2d"), previewCanvas.getContext("2d"));

document.addEventListener("keydown", handleGameKey);

document.getElementById("btnRotate").addEventListener("click", () => tetris.rotatePiece());
document.getElementById("btnStart").addEventListener("click", () => tetris.start());


function handleGameKey(event) {
  if (event.keyCode === KEY.UP) {
    tetris.rotatePiece();
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
