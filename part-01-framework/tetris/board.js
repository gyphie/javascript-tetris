// step 01
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

  draw() {
    // clear the board by drawing the background
    this.#canvas.fillStyle = "#eeeeee";
    this.#canvas.fillRect(0, 0, this.#width, this.#height);

  }
}
