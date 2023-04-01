//Базовый вариант - решение задачи коммивояжёра. Вы генерируете плоскость, на которой пользователь расставляет точки - вершины графа. Веса ребёр - расстояние на плоскости между вершинами. Ваша задача - реализовать генетический алгоритм, который построит путь коммивояжера по этому графу. Пока алгоритм работает, вы показываете лучшую особь на последней достигнутой итерации алгоритма. Следовательно, при завершении алгоритма лучшая особь - потенциально лучший путь коммивояжера.

// Создание объекта canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Задание размеров canvas
var width = (canvas.width = window.innerWidth);
var height = (canvas.height = window.innerHeight);

function DrawInCanvas(color, x, y) {
  contex.beginPath();
  contex.rect(x * Cellsize, y * Cellsize, Cellsize, Cellsize);
  contex.fillStyle = color;
  contex.fill();
}

// Создание массива точек
var points = [];
for (var i = 0; i < 50; i++) {
  points.push({
    x: Math.random() * width,
    y: Math.random() * height,
  });
}
//Создание и отрисовка точек по щелчку мыши
canvas.addEventListener("click", function (event) {
  points.push({
    x: event.clientX,
    y: event.clientY,
  });
  DrawInCanvas("black", event.clientX, event.clientY);
});

// Создание начальной популяции
var population = [];
var populationSize = 100;
for (var i = 0; i < populationSize; i++) {
  population.push(shuffle(points.slice()));
}

// Функция перемешивания массива
function shuffle(array) {
  var copy = array.slice();
  for (var i = 0; i < copy.length; i++) {
    var j = Math.floor(Math.random() * copy.length);
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Функция вычисления длины маршрута
function distance(points) {
  var sum = 0;
  for (var i = 1; i < points.length; i++) {
    var dx = points[i].x - points[i - 1].x;
    var dy = points[i].y - points[i - 1].y;
    sum += Math.sqrt(dx * dx + dy * dy);
  }
  return sum;
}

// Функция селекции особей
function selection(population) {
  var sorted = population.slice().sort(function (a, b) {
    return distance(a) - distance(b);
  });
  return sorted.slice(0, populationSize / 2);
}

// Функция кроссинговера
function crossover(a, b) {
  var start = Math.floor(Math.random() * a.length);
  var end = Math.floor(Math.random() * a.length);
  if (start > end) {
    var temp = start;
    start = end;
    end = temp;
  }
  var child = a.slice(start, end);
  for (var i = 0; i < b.length; i++) {
    var point = b[i];
    if (!child.includes(point)) {
      child.push(point);
    }
  }
  return child;
}

// Функция мутации
function mutation(points) {
  var i = Math.floor(Math.random() * points.length);
  var j = Math.floor(Math.random() * points.length);
  var temp = points[i];
  points[i] = points[j];
  points[j] = temp;
}

// Главный цикл алгоритма
var best = null;
var iteration = 0;
function loop() {
  ctx.clearRect(0, 0, width, height);

  // Вычисление длины лучшего маршрута и отображение его на canvas
  var bestDistance = distance(population[0]);
  if (best == null || bestDistance < distance(best)) {
    best = population[0];
  }
  ctx.beginPath();
  ctx.moveTo(best[0].x, best[0].y);
  for (var i = 1; i < best.length; i++) {
    ctx.lineTo(best[i].x, best[i].y);
  }
  ctx.lineTo(best[0].x, best[0].y);
  ctx.stroke();

  // Отображение точек на canvas
  for (var i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Создание новой популяции
  var newPopulation = selection(population);
  for (var i = 0; i < populationSize / 2; i++) {
    var a = Math.floor(Math.random() * newPopulation.length);
    var b = Math.floor(Math.random() * newPopulation.length);
    var child = crossover(newPopulation[a], newPopulation[b]);
    mutation(child);
    newPopulation.push(child);
  }

  population = newPopulation;

  iteration++;
  requestAnimationFrame(loop);
}
