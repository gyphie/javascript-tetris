// step 01
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
    [1, 1, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
];
