// step 01
import { Game } from "./tetris/game.js";

const gameBoardCanvas = document.getElementById("gameBoard");
const previewCanvas = document.getElementById("preview");

const tetris = new Game(gameBoardCanvas.getContext("2d"), previewCanvas.getContext("2d"));

tetris.start();
