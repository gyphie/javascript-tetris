// step 02
export class Piece {
  #x;
  #y;

  #type;
  #shapeData;
  #color;

  get drawData() {
    return {
      x: this.#x,
      y: this.#y,
      color: this.#color,
      shapeData: Piece.copyShapeData(this.#shapeData)
    }
  }

  constructor(type) {
    this.#type = type;
    this.#x = 0;
    this.#y = 0;
    this.#color = pieceColor[type];
    this.#shapeData = Piece.copyShapeData(pieceShapeData[type]);
  }

  rotate() {
    let rotatedShapeData = JSON.parse(JSON.stringify(this.#shapeData));

    for (let row = 0; row < rotatedShapeData.length; row++) {
      for (let column = 0; column < row; column++) {
        [rotatedShapeData[column][row], rotatedShapeData[row][column]] = [
          rotatedShapeData[row][column],
          rotatedShapeData[column][row]
        ];
      }
    }

    rotatedShapeData.forEach(row => row.reverse());

    this.#shapeData = rotatedShapeData;
  }

  static copyShapeData(shapeData) {
    return shapeData.map(x => [...x]);
  }
}


const pieceColor = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "gray",
];

const pieceShapeData = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0]
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
];
