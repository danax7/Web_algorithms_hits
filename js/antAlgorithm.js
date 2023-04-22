const countOfAunts = document.querySelector("#countOfAnts");
const alpha = document.querySelector("#alpha");
const beta = document.querySelector("#beta");
const evaporationRate = document.querySelector("#evaporationRate");
const initialPheromone = document.querySelector("#initialPheromone");
const countOfIterations = document.querySelector("#countOfIterations");
const sheet = document.querySelector(".clustering__sheet");
const start = document.querySelector("#start");
const resultElement = document.querySelector("#result");
const lines = document.getElementsByClassName("ant-algorithm__line");
const numbers = document.getElementsByClassName("ant-algorithm__index");

const getDistance = (firstElement, secondElement) =>
  Math.sqrt(
    Math.pow(firstElement.x - secondElement.x, 2) +
      Math.pow(firstElement.y - secondElement.y, 2)
  );

function drawLine(element, element2, index) {
  const line = document.createElement("div");
  const number = document.createElement("div");

  const length = getDistance(element, element2);
  let sin =
    (Math.asin(Math.abs(element.y - element2.y) / length) * 180) / Math.PI;
  let cos =
    (Math.acos(Math.abs(element.y - element2.y) / length) * 180) / Math.PI;

  number.style.left = `${element.x}px`;
  number.style.top = `${element.y - 18}px`;
  if (element.x <= element2.x && element.y <= element2.y) {
    line.style.transform = `rotate(${sin}deg)`;
  } else if (element.x <= element2.x && element.y >= element2.y) {
    line.style.transform = `rotate(${360 - sin}deg)`;
  } else if (element.x >= element2.x && element.y >= element2.y) {
    line.style.transform = `rotate(${sin + 180}deg)`;
  } else {
    line.style.transform = `rotate(${cos + 90}deg)`;
  }

  line.style.width = `${length}px`;
  line.style.left = `${element.x + 3}px`;
  line.style.top = `${element.y + 3}px`;
  line.classList.add("ant-algorithm__line");

  number.innerText = index;
  number.classList.add("ant-algorithm__index");

  sheet.append(line);
  sheet.append(number);
}

const draw = (points, path, distance) => {
  for (let i = 0; i < lines.length; ) {
    lines[i].remove();
  }
  for (let i = 0; i < numbers.length; ) {
    numbers[i].remove();
  }
  for (let i = 0; i < path.length - 1; i++) {
    drawLine(points[path[i]], points[path[i + 1]], i + 1);
  }
  resultElement.textContent = `${distance}`;
};

const antAlgorithm = (
  points,
  countOfAunts,
  countOfCities,
  distanceMatrix,
  a,
  b,
  evaporationRate,
  initialPheromone,
  countOfIterations
) => {
  let pheromoneMatrix = [];
  for (let i = 0; i < countOfCities; i++) {
    pheromoneMatrix.push([]);
    for (let j = 0; j < countOfCities; j++) {
      pheromoneMatrix[i].push(initialPheromone);
    }
  }
  let bestPath = [];
  let bestDistance = Infinity;
  for (let iter = 0; iter < countOfIterations; iter++) {
    var antPaths = [];
    for (let ant = 0; ant < countOfAunts; ant++) {
      let currentCity = Math.round(Math.random() * (countOfCities - 1));
      let path = [];
      let visited = Array(countOfCities).fill(false);
      visited[currentCity] = true;
      path.push(currentCity);
      while (true) {
        currentCity = path[path.length - 1];
        if (currentCity == path[0] && path.length != 1) break;
        let sum = 0,
          nextCity = -1;
        let arrProbability = Array(countOfCities).fill(0);
        for (let i = 0; i < countOfCities; i++) {
          if (!visited[i] || (path.length == countOfCities && i == path[0])) {
            arrProbability[i] =
              Math.pow(pheromoneMatrix[currentCity][i], a) *
              Math.pow(100 / distanceMatrix[currentCity][i], b);
            sum += arrProbability[i];
          }
        }
        arrProbability = arrProbability.map((element) => element / sum);
        sum = 0;
        let probability = Math.random();
        for (let i = 0; nextCity == -1; i++) {
          sum += arrProbability[i];
          if (probability <= sum) nextCity = i;
        }
        path.push(nextCity);
        visited[nextCity] = true;
      }
      antPaths.push(path);
    }

    for (let i = 0; i < countOfCities; i++) {
      for (let j = 0; j < countOfCities; j++) {
        let totalChange = 0;
        for (let ant = 0; ant < countOfAunts; ant++) {
          let index = antPaths[ant].indexOf(i);
          if (index != -1 && antPaths[ant][index + 1] == j) {
            totalChange += 1 / distanceMatrix[i][j];
          }
        }
        pheromoneMatrix[i][j] =
          (1 - evaporationRate) * pheromoneMatrix[i][j] + totalChange;
      }
    }

    for (let ant = 0; ant < countOfAunts; ant++) {
      let path = antPaths[ant];
      let distance = 0;
      for (let i = 0; i < countOfCities; i++) {
        distance += distanceMatrix[path[i]][path[i + 1]];
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPath = path;
        setTimeout(draw, 100, points, path, bestDistance);
      }
    }
  }
};

let points = [];
sheet.addEventListener("click", (event) => {
  if (!event.target.closest(".clustering__point")) {
    let x =
      event.clientX -
      Math.ceil(event.currentTarget.getBoundingClientRect().x) -
      6;
    let y =
      event.clientY -
      Math.ceil(event.currentTarget.getBoundingClientRect().y) -
      6;

    if (x < 0) x += 6;
    if (y < 0) y += 6;
    const newPount = document.createElement("div");
    newPount.style.left = `${x}px`;
    newPount.style.top = `${y}px`;
    newPount.classList.add("ant-algorithm__point");
    sheet.append(newPount);
    points.push({ x: x, y: y });
  }
});

start.addEventListener("click", () => {
  let matrix = [];

  points.forEach((element, index) => {
    matrix.push([]);
    points.forEach((elementTwo, indexTwo) => {
      matrix[index].push(getDistance(element, elementTwo));
    });
  });
  antAlgorithm(
    points,
    Number(countOfAunts.value),
    points.length,
    matrix,
    Number(alpha.value),
    Number(beta.value),
    Number(evaporationRate.value),
    Number(initialPheromone.value),
    Number(countOfIterations.value)
  );
});
