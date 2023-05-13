// step 04
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

    this.#currentPiece.snapshot();
    this.#currentPiece.rotate();

    if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
      // try moving the piece back up and see if will fit
      this.#currentPiece.rollback();
      this.#currentPiece.moveUp();
      this.#currentPiece.rotate();
      if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
        // try moving the piece left (maybe it was too close to the wall)
        this.#currentPiece.rollback();
        this.#currentPiece.moveLeft();
        this.#currentPiece.rotate();
  
        if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
          // try moving the piece left (maybe it was too close to the other wall)
          this.#currentPiece.rollback();
          this.#currentPiece.moveRight();
          this.#currentPiece.rotate();

          if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
            this.#currentPiece.rollback();
            return;
          }
        }
      }
    }

    this.#board.draw(this.#currentPiece);
  }

  moveLeft() {
    if (this.#state !== GAMESTATE.running) {
      return;
    }

    this.#currentPiece.snapshot();
    this.#currentPiece.moveLeft();

    if (this.#board.isPiecePositionValid(this.#currentPiece)) {
      this.#board.draw(this.#currentPiece);
    } else {
      this.#currentPiece.rollback();
    }
  }

  moveRight() {
    if (this.#state !== GAMESTATE.running) {
      return;
    }

    this.#currentPiece.snapshot();
    this.#currentPiece.moveRight();

    if (this.#board.isPiecePositionValid(this.#currentPiece)) {
      this.#board.draw(this.#currentPiece);
    } else {
      this.#currentPiece.rollback();
    }
  }

  moveDown() {
    if (this.#state !== GAMESTATE.running) {
      return;
    }

    if (this.movePieceDown()) {
      this.#board.draw(this.#currentPiece);
    }
  }

  dropPiece() {
    if (this.#state !== GAMESTATE.running) {
      return;
    }

    while(this.movePieceDown()) {}

    this.#board.draw(this.#currentPiece);
  }

  // Game methods
  movePieceDown() {
    this.#currentPiece.snapshot();
    this.#currentPiece.moveDown();

    if (this.#board.isPiecePositionValid(this.#currentPiece)) {
      return true;
    } else {
      this.#currentPiece.rollback();
      return false;
    }
  }

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
