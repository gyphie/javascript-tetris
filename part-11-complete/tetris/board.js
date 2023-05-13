// step 09
export class Board {
  #canvas;
  #width;
  #height;
  #blockSize;
  #backgroundColor;

  #shapeData;
  
  get width() {
    return this.#width;
  }

  constructor(canvas, width, height, blockSize, backgroundColor) {
    this.#canvas = canvas;
    this.#width = width;
    this.#height = height;
    this.#blockSize = blockSize;
    this.#backgroundColor = backgroundColor;

    this.init();
  }

  init() {
    this.#canvas.canvas.width = this.#width * this.#blockSize;
    this.#canvas.canvas.height = this.#height * this.#blockSize;
    this.#canvas.scale(this.#blockSize, this.#blockSize);
  }

  reset() {
    this.#shapeData = [];
    for (let i = 0; i < this.#width * this.#height; i++) {
      this.#shapeData[i] = 0;
    }
  }

  addPiece(piece) {
    const drawData = piece.drawData;

    for (let row = 0; row < drawData.shapeData.length; row++) {
      for (let column = 0; column < drawData.shapeData[row].length; column++) {
        if (drawData.shapeData[row][column] !== 0) {
          const shapeDataIdx = drawData.y * this.#width + drawData.x + row * this.#width + column;
          this.#shapeData[shapeDataIdx] = drawData.color;
        }
      }
    }
  }

  clearCompletedLines() {
    let completedLineCount = 0;

    for (let row = 0; row < this.#shapeData.length; row += this.#width) {
      let isCompleteLine = true;
      for (let column = row; column < row + this.#width; column++) {
        if (this.#shapeData[column] === 0) {
          isCompleteLine = false;
          break;
        }
      }

      if (isCompleteLine) {
        completedLineCount++;
        this.#shapeData.splice(row, this.#width);
        this.#shapeData.unshift(...Array(this.#width).fill(0));
      }
    }

    return completedLineCount;
  }

  draw(piece) {
    // clear the board by drawing the background
    this.#canvas.fillStyle = this.#backgroundColor;
    this.#canvas.fillRect(0, 0, this.#width, this.#height);

    // draw the piece
    const drawData = piece.drawData;

    this.#canvas.fillStyle = drawData.color;
    for (let row = 0; row < drawData.shapeData.length; row++) {
      for (let column = 0; column < drawData.shapeData[row].length; column++) {
        const shapePart = drawData.shapeData[row][column];
        if (shapePart !== 0) {
          this.#canvas.fillRect(drawData.x + column, drawData.y + row, 1, 1);
        }
      }
    }

    // draw the board
    let row = 0, column = 0;
    for (let i = 0; i < this.#shapeData.length; i++) {
      if (this.#shapeData[i]) {
        this.#canvas.fillStyle = this.#shapeData[i];
        this.#canvas.fillRect(column, row, 1, 1);
      }

      column++;
      if (column >= this.#width) {
        column = 0;
        row++;
      }
    }
  }

  drawGameOver(message) {
    this.#canvas.fillStyle = "black";
    this.#canvas.fillRect(1, 3, this.#width - 2, 1.5);
    this.#canvas.font = "1px Arial";
    this.#canvas.fillStyle = "red";
    const textWidth = this.#canvas.measureText(message).width;
    this.#canvas.fillText(message, textWidth / 2, 4.1, 8);
  }

  isPiecePositionValid(piece) {
    const drawData = piece.drawData;

    for (let row = 0; row < drawData.shapeData.length; row++) {
      for (let column = 0; column < drawData.shapeData[row].length; column++) {
        if (drawData.shapeData[row][column] !== 0) {
          const xOnBoard = drawData.x + column;
          const yOnBoard = drawData.y + row;
          
          if (!this.isValidPosition(xOnBoard, yOnBoard)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  isValidPosition(x, y) {
    // Check the walls
    if (x < 0) return false;
    if (x >= this.#width) return false;

    // Check the floor
    if (y >= this.#height) return false;
    
    // Check the ceiling. Don't worry about pieces above the ceiling.
    if (y < 0) return true;

    // Check whether the position is already occupied
    const shapeDataIdx = y * this.#width + x;
    if (this.#shapeData[shapeDataIdx] !== 0) return false;

    return true;
  }

}
