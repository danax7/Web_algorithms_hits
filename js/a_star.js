const wallColor = "black";
const freeColor = "#ccc";
const FinishColor = "red";
const StartColor = "green";
const Pathcolor = "purple";
const CurrentColor = "#1B9AF7";
var matrix = [];
var MatrixSize = 30;
var canvas = document.getElementById("canvas");
var contex = canvas.getContext("2d");
var speed = 3;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

var startCords = new Cell(0, 0);
var finishCords = new Cell(0, 0);
var Graph = new Array(MatrixSize);
var FinishButton = false;
var StartButton = false;
var CreateWallButton = false;
var RemoveWallButton = false;
var Cellsize;

function DrawInCanvas(color, x, y) {
  contex.beginPath();
  contex.rect(x * Cellsize, y * Cellsize, Cellsize, Cellsize);
  contex.fillStyle = color;
  contex.fill();
}

//Служебные функции
document.addEventListener("DOMContentLoaded", function () {
  CreateMazes();
});

function changeMatrixSize() {
  var matrixSize = document.getElementById("matrixSize").value;
  document.getElementById("rangeValue").innerHTML = matrixSize;
  canvas.clear();
  CreateMazes();
}
//

//создание матрицы и генерация лабиринта
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const erasers = {
  x: 0,
  y: 0,
};

async function main(matrix) {
  document
    .getElementById("matrixSize")
    .addEventListener("mouseup", function () {
      MatrixSize = Number(document.getElementById("matrixSize").value);
    });
  var size = MatrixSize;
  if (MatrixSize % 2 === 0) {
    size--;
    for (let i = 0; i < MatrixSize; i++) {
      matrix[i][size] = randomInteger(0, 1);
      matrix[size][i] = randomInteger(0, 1);
    }
  }
  while (!isValidMaze(matrix)) {
    MoveErase(size, erasers);
  }

  DrawMaze(MatrixSize, MatrixSize);
}

function CreateMatrix() {
  document
    .getElementById("matrixSize")
    .addEventListener("mouseup", function () {
      MatrixSize = Number(document.getElementById("matrixSize").value);
    });

  startCords = new Cell(0, 0);
  finishCords = new Cell(0, 0);
  FinishButton = false;
  StartButton = false;
  matrix = [];
  for (let y = 0; y < MatrixSize; y++) {
    const row = [];
    for (let x = 0; x < MatrixSize; x++) {
      row.push(false);
    }
    matrix.push(row);
  }
  matrix[0][0] = true;

  return matrix;
}

function DrawMaze(columns, rows) {
  Cellsize = canvas.width / MatrixSize;
  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      const color = matrix[y][x] ? freeColor : wallColor;
      DrawInCanvas(color, x, y);
    }
  }
}

//Алгоритм блуждания или Randomized Prim's algorithm
//https://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
function MoveErase(size, eraser) {
  const directions = [];

  if (eraser.x > 0) {
    directions.push([-2, 0]);
  }

  if (eraser.x < size - 1) {
    directions.push([2, 0]);
  }

  if (eraser.y > 0) {
    directions.push([0, -2]);
  }

  if (eraser.y < size - 1) {
    directions.push([0, 2]);
  }

  var [dx, dy] = getRandomItem(directions);

  eraser.x += +dx;
  eraser.y += +dy;

  if (eraser.x < 0) {
    eraser.x *= -1;
  }
  if (eraser.y < 0) {
    eraser.y *= -1;
  }
  if (eraser.x >= size) {
    eraser.x = size - 1;
    dy;
  }
  if (eraser.y >= size) {
    eraser.y = size - 1;
  }
  if (!matrix[eraser.y][eraser.x]) {
    matrix[eraser.y][eraser.x] = true;
    matrix[eraser.y - dy / 2][eraser.x - dx / 2] = true;
  }
}

function getRandomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function isValidMaze(matrix) {
  for (let y = 0; y < MatrixSize; y += 2) {
    for (let x = 0; x < MatrixSize; x += 2) {
      if (!matrix[y][x]) {
        return false;
      }
    }
  }
  return true;
}

//обработчики событий
canvas.clear = function () {
  contex.clearRect(0, 0, 730, 730);
  startCords = new Cell(0, 0);
  finishCords = new Cell(0, 0);
  FinishButton = false;
  StartButton = false;
  matrix = [];
};

function CreateMazes() {
  matrix = CreateMatrix();
  main(matrix);
}

function CreateWall() {
  CreateWallButton = true;
  RemoveWallButton = false;
}

function RemoveWall() {
  CreateWallButton = false;
  RemoveWallButton = true;
}

//Нажатие на canvas в соответствующих условиях
canvas.addEventListener("mousedown", function (e) {
  let cordX, cordY;
  cordX = e.pageX - this.offsetLeft;
  cordY = e.pageY - this.offsetTop;
  let x = Math.trunc(cordX / Cellsize);
  let y = Math.trunc(cordY / Cellsize);
  if (matrix[y][x] === true || matrix[y][x] === 1) {
    if (FinishButton) {
      finishCords.x = x;
      finishCords.y = y;
      FinishButton = false;
      DrawInCanvas(FinishColor, x, y);
    } else if (StartButton) {
      startCords.x = x;
      startCords.y = y;
      StartButton = false;
      DrawInCanvas(StartColor, x, y);
    }
    if (CreateWallButton) {
      matrix[y][x] = false;
      DrawMaze(MatrixSize, MatrixSize);
    }
  } else if (!RemoveWallButton) {
    alert("Это стена!");
  } else if (RemoveWallButton) {
    matrix[y][x] = true;
    DrawMaze(MatrixSize, MatrixSize);
  }
});

function DrawFinish() {
  CreateWallButton = false;
  RemoveWallButton = false;
  FinishButton = true;
  StartButton = false;
}

function DrawStart() {
  CreateWallButton = false;
  RemoveWallButton = false;
  StartButton = true;
  FinishButton = false;
}

//алгоритм А*
//Значение эвристической функции - это оценка стоимости достижения цели или решения задачи

class Node {
  constructor(value, f, g, h, X, Y) {
    this.value = value;
    this.f = f; //энергия, которую мы потратили, чтобы добраться до этого узла
    this.h = h; //значение эвристики, которое мы используем для оценки расстояния от текущего узла до конечного узла
    this.g = g; //расстояние от текущего узла до конечного узла
    this.X = X;
    this.Y = Y;
  }
}
var current = [];
function createMatrix() {
  for (let i = 0; i < MatrixSize; i++) {
    Graph[i] = new Array(MatrixSize);
  }
  for (let i = 0; i < MatrixSize; i++) {
    for (let j = 0; j < MatrixSize; j++) {
      Graph[i][j] = new Node(0, 0, 0, 0, 0, 0);
      Graph[i][j].value = 0;
      if (matrix[i][j] === 1 || matrix[i][j] === true) {
        Graph[i][j].value = 1;
      }
    }
  }
}

let index = 0;
let breakFlag = false;
let OpenList = [];
let CloseList = [];

function GetDist(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y); //эвристическая функция - манхэттенское расстояние (Приблизительное расстояние между двумя точками)
}

function isClosed(temp) {
  for (let i = 0; i < CloseList.length; i++) {
    if (temp.x === CloseList[i].x && temp.y === CloseList[i].y) {
      return true;
    }
  }
  return false;
}

function isOpened(temp) {
  for (let i = 0; i < OpenList.length; i++) {
    if (temp.x === OpenList[i].x && temp.y === OpenList[i].y) {
      return true;
    }
  }
  return false;
}

function getMinCell() {
  let min = 100000;
  let temp = new Cell(0, 0);

  for (let i = 0; i < OpenList.length; i++) {
    const dx = OpenList[i].x;
    const dy = OpenList[i].y;

    if (Graph[dy][dx].h < min) {
      min = Graph[dy][dx].h;
      index = i;
      temp = new Cell(dx, dy);
    }
  }
  return temp;
}

var cell = new Cell(0, 0);

function checkNeighbor(x, y, current) {
  if (Graph[y][x].value !== 0 && !isClosed(new Cell(x, y))) {
    if (!isOpened(new Cell(x, y))) {
      Graph[y][x].X = current.x;
      Graph[y][x].Y = current.y;
      Graph[y][x].h = GetDist(new Cell(x, y), finishCords);
      Graph[y][x].g = 10 + Graph[current.y][current.x].g;
      Graph[y][x].f = Graph[y][x].h + Graph[y][x].g;
      OpenList.push(new Cell(x, y));
      cell.x = x;
      cell.y = y;
      DrawCurrent();
      if (x === finishCords.x && y === finishCords.y) {
        breakFlag = true;
        return 0;
      }
    } else if (Graph[y][x].g > Graph[current.y][current.x].g) {
      Graph[y][x].X = current.x;
      Graph[y][x].Y = current.y;
      Graph[y][x].g = 10 + Graph[current.y][current.x].g;
      Graph[y][x].f = Graph[y][x].h + Graph[y][x].g;
    }
  }
}

function checkTop(current) {
  let x = current.x;
  let y = current.y;
  if (y - 1 >= 0) {
    checkNeighbor(x, y - 1, current);
  }
}

function checkBottom(current) {
  let x = current.x;
  let y = current.y;
  if (y + 1 < MatrixSize) {
    checkNeighbor(x, y + 1, current);
  }
}

function checkSides(current) {
  let x = current.x;
  let y = current.y;
  if (x - 1 >= 0) {
    checkNeighbor(x - 1, y, current);
  }
  if (x + 1 < MatrixSize) {
    checkNeighbor(x + 1, y, current);
  }
}

function CheckPath(current) {
  checkTop(current);
  checkBottom(current);
  checkSides(current);

  if (breakFlag) {
    return 0;
  }

  CloseList.push(current);
  OpenList.splice(index, 1); //удаляем из списка открытых вершин текущую вершину
  if (OpenList.length === 0) {
    return 0;
  }
  current = getMinCell();
  //CheckPath(current);
  return 0;
}

async function DrawPath() {
  var num;
  num = SpeedSelection();
  let x = finishCords.x;
  let y = finishCords.y;
  while (x !== startCords.x || y !== startCords.y) {
    if (x !== finishCords.x || y !== finishCords.y) {
      DrawInCanvas(Pathcolor, x, y);
    }
    let temp = x;
    x = Graph[y][temp].X;
    y = Graph[y][temp].Y;
    await new Promise((resolve) => setTimeout(resolve, num));
  }
}

async function DrawCurrent() {
  if (cell.x !== finishCords.x || cell.y !== finishCords.y) {
    if (Graph[cell.y][cell.x].value !== 0) {
      DrawInCanvas(CurrentColor, cell.x, cell.y);
    }
  }
}

function SpeedSelection() {
  const speedInput = document.getElementById("Speed");
  const speed = Number(speedInput.value);
  if (speed === 6) {
    return 0;
  }
  const maxSpeed = 6;
  const minDelay = 10; // minimum delay in ms
  const maxDelay = 50; // maximum delay in ms
  const delayRange = maxDelay - minDelay;
  const speedStep = maxSpeed / delayRange;
  const delay = Math.round(minDelay + (maxSpeed - speed) / speedStep);
  speedInput.addEventListener("mouseup", function () {
    if (speedInput.value === 6) {
      return 0;
    }
    delay = Math.round(
      minDelay + (maxSpeed - Number(speedInput.value)) / speedStep
    );
  });
  return delay;
}

//https://neerc.ifmo.ru/wiki/index.php?title=%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_A*
async function AStar() {
  var num;
  let flag = false;
  OpenList.push(startCords);
  CheckPath(startCords);
  while (!breakFlag) {
    var min = getMinCell();
    CheckPath(min);
    if (OpenList.length <= 0) {
      flag = true;
      alert("Путь не был найден");
      break;
    }
    num = SpeedSelection();
    await new Promise((resolve) => setTimeout(resolve, num));
  }
  if (!flag) {
    await DrawPath();
  }

  OpenList.length = 0;
  CloseList.length = 0;
  index = 0;
  breakFlag = false;
}

async function FindingPath() {
  createMatrix();
  if (
    startCords.x !== 0 &&
    startCords.x !== 0 &&
    finishCords.x !== 0 &&
    finishCords.y !== 0
  ) {
    await AStar();
  } else {
    alert("Выберите старт и финиш!");
  }
}
