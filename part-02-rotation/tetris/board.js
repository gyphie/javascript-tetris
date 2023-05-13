// step 02
export class Board {
  #canvas;
  #width;
  #height;
  #blockSize;

  #shapeData;
  
  constructor(canvas, width, height, blockSize) {
    this.#canvas = canvas;
    this.#width = width;
    this.#height = height;
    this.#blockSize = blockSize;

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

  draw(piece) {
    // clear the board by drawing the background
    this.#canvas.fillStyle = "#eeeeee";
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
  }
}
