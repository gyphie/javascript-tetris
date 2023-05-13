// step 02
import { Board } from "./board.js";
import { Piece } from "./piece.js";

export class Game {
  #state;
  #board;
  #currentPiece;
  #previewPiece;
  
  #previewPieceCtx;


  constructor(boardCtx, previewCtx) {
    this.#state = GAMESTATE.stopped;
    this.#board = new Board(boardCtx, 10, 20, 80);

    this.#previewPieceCtx = previewCtx;
    this.#previewPieceCtx.canvas.width = 4 * 80;
    this.#previewPieceCtx.canvas.height = 4 * 80;
    this.#previewPieceCtx.scale(80, 80);
  }

  // UI interaction
  start() {
    this.#board.reset();

    this.#currentPiece = new Piece(3);
    this.#previewPiece = new Piece(1);

    this.drawPreview();
    this.#board.draw(this.#currentPiece);

    this.#state = GAMESTATE.running;
  }

  rotatePiece() {
    if (this.#state !== GAMESTATE.running) {
      return;
    }

    this.#currentPiece.rotate();
    this.#board.draw(this.#currentPiece);
  }
  
  // Game methods
  drawPreview() {
    const drawData = this.#previewPiece.drawData;

    this.#previewPieceCtx.fillStyle = drawData.color;
    for (let row = 0; row < drawData.shapeData.length; row++) {
      for (let column = 0; column < drawData.shapeData[row].length; column++) {
        const shapePart = drawData.shapeData[row][column];
        if (shapePart !== 0) {
          this.#previewPieceCtx.fillRect(column, row, 1, 1);
        }
      }
    }
  }
}

const GAMESTATE = {
  "stopped": 0,
  "running": 1,
  "gameover": 2
};
