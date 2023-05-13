// step 10
import { Board } from "./board.js";
import { Piece } from "./piece.js";

export class Game {
  #state;
  #stats;
  #board;
  #preview;
  #currentPiece;
  #previewPiece;

  #onStatsChanged;

  constructor(settings) {
    this.#state = {
      run: GAMESTATE.stopped,
      animationRequestID: undefined,
      animationTimer: 0,
      dropDelay: 0
    };

    this.#onStatsChanged = settings.statsChanged;

    this.#board = new Board(
      settings.gameBoard.canvas,
      settings.gameBoard.width,
      settings.gameBoard.height,
      settings.gameBoard.blockSize,
      settings.gameBoard.backgroundColor
    );

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

    this.resetStats();

    this.#previewPiece = Piece.getRandomPiece();
    this.getNewPieces();

    this.#preview.draw(this.#previewPiece);
    this.#board.draw(this.#currentPiece);

    this.#state.animationTimer = 0;
    this.#state.dropDelay = this.calculateDropDelay(this.#stats.level);
    this.#state.run = GAMESTATE.running;

    this.startGameLoop();
  }

  startGameLoop() {
    this.#state.animationTimer = 0;
    this.#state.animationRequestID = window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  stopGameLoop() {
    window.cancelAnimationFrame(this.#state.animationRequestID);
  }

  gameLoop(timestamp) {
    if (this.#state.run !== GAMESTATE.running) {
      return;
    }

    if (this.#state.animationTimer === 0) {
      this.#state.animationTimer = timestamp;
    } else {
      const previousTimestamp = this.#state.animationTimer;

      if (timestamp - previousTimestamp > this.#state.dropDelay) {
        this.#state.animationTimer = timestamp;
        this.movePieceDown();

        if (this.#state.run !== GAMESTATE.running) {
          return;
        }
      }
    }

    this.#preview.draw(this.#previewPiece);
    this.#board.draw(this.#currentPiece);

    this.#state.animationRequestID = window.requestAnimationFrame(
      this.gameLoop.bind(this)
    );
  }

  rotatePiece() {
    if (this.#state.run !== GAMESTATE.running) {
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
  }

  moveLeft() {
    if (this.#state.run !== GAMESTATE.running) {
      return;
    }

    this.#currentPiece.snapshot();
    this.#currentPiece.moveLeft();

    if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
      this.#currentPiece.rollback();
    }
  }

  moveRight() {
    if (this.#state.run !== GAMESTATE.running) {
      return;
    }

    this.#currentPiece.snapshot();
    this.#currentPiece.moveRight();

    if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
      this.#currentPiece.rollback();
    }
  }

  moveDown() {
    if (this.#state.run !== GAMESTATE.running) {
      return false;
    }

    this.stopGameLoop();

    this.movePieceDown();

    this.startGameLoop();
  }

  dropPiece() {
    if (this.#state.run !== GAMESTATE.running) {
      return;
    }

    this.stopGameLoop();

    let dropHeight = 0;
    while (this.movePieceDown()) {
      dropHeight++;
    }

    this.#stats.score += dropHeight * SCORE.DROP_VALUE;
    if (this.#onStatsChanged) this.#onStatsChanged(this.#stats);

    this.startGameLoop();
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

    const linesCleared = this.#board.clearCompletedLines();

    if (linesCleared > 0) {
      this.#stats.score += SCORE.LINE[linesCleared - 1];

      for (let i = 0; i < linesCleared; i++) {
        this.#stats.lines++;

        if (this.#stats.lines % 10 === 0) {
          this.#stats.level++;
          this.#stats.score += SCORE.LEVEL * this.#stats.level;
          this.#state.dropDelay = this.calculateDropDelay(this.#stats.level);
        }
      }

      if (this.#onStatsChanged) this.#onStatsChanged(this.#stats);
    }

    const canContinue = this.getNewPieces();

    if (!canContinue) {
      do {
        this.#currentPiece.moveUp();
      } while (!this.#board.isPiecePositionValid(this.#currentPiece));

      this.gameOver();
    }
  }

  gameOver() {
    this.#state.run = GAMESTATE.gameover;

    this.#board.draw(this.#currentPiece);
    this.#board.drawGameOver("Game Over");
  }

  getNewPieces() {
    this.#currentPiece = this.#previewPiece;
    this.#currentPiece.x =
      Math.floor(this.#board.width / 2) -
      Math.floor(this.#currentPiece.shapeWidth / 2);

    if (!this.#board.isPiecePositionValid(this.#currentPiece)) {
      return false;
    }

    this.#previewPiece = Piece.getRandomPiece();

    return true;
  }

  resetStats() {
    this.#stats = {
      score: 0,
      level: 1,
      lines: 0
    };

    if (this.#onStatsChanged) this.#onStatsChanged(this.#stats);
  }

  calculateDropDelay(gameLevel) {
    const baseDelay = 1000;
    return Math.floor(baseDelay - 150 * (gameLevel - 1));
  }
}

const GAMESTATE = {
  stopped: 0,
  running: 1,
  gameover: 2
};

const SCORE = {
  DROP_VALUE: 5,
  LINE: [50, 150, 300, 600],
  LEVEL: 1000
};
