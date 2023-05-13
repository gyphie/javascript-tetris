// step 07
import { Board } from "./board.js";
import { Piece } from "./piece.js";

export class Game {
  #state;
  #board;
  #preview;
  #currentPiece;
  #previewPiece;
  

  constructor(settings) {
    this.#state = GAMESTATE.stopped;
    this.#board = new Board(
      settings.gameBoard.canvas,
      settings.gameBoard.width,
      settings.gameBoard.height,
      settings.gameBoard.blockSize,
      settings.gameBoard.backgroundColor);

    this.#preview = new Board(
      settings.preview.canvas,
      settings.preview.width,
      settings.preview.height,
      settings.preview.blockSize,
      settings.preview.backgroundColor
    );
  }

  // UI interaction
  start() {
    this.#board.reset();
    this.#preview.reset();

    this.#previewPiece = Piece.getRandomPiece();
    this.getNewPieces();

    this.#preview.draw(this.#previewPiece);
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
  }

  // Game methods
  movePieceDown() {
    this.#currentPiece.snapshot();
    this.#currentPiece.moveDown();

    if (this.#board.isPiecePositionValid(this.#currentPiece)) {
      return true;
    } else {
      this.#currentPiece.rollback();

      this.pieceTouch();

      return false;
    }
  }

  pieceTouch() {
    this.#board.addPiece(this.#currentPiece);
    
    this.#board.clearCompletedLines();

    const canContinue = this.getNewPieces();

    if (canContinue) {
      this.#preview.draw(this.#previewPiece);
      this.#board.draw(this.#currentPiece);
    } else {
      do {
        this.#currentPiece.moveUp();
      } while (!this.#board.isPiecePositionValid(this.#currentPiece));
  
      this.#board.draw(this.#currentPiece);
  
      this.gameOver();
    }
  }

  gameOver() {
    this.#state = GAMESTATE.gameover;

    this.#board.drawGameOver("Game Over");
  }

  getNewPieces() {
    this.#currentPiece = this.#previewPiece;
    this.#currentPiece.x = Math.floor(this.#board.width / 2) - Math.floor(this.#currentPiece.shapeWidth / 2);

    if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
      return false;
    }

    this.#previewPiece = Piece.getRandomPiece();

    return true;
  }

}

const GAMESTATE = {
  "stopped": 0,
  "running": 1,
  "gameover": 2
};
