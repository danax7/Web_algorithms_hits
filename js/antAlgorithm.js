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

function getDistance(x1, x2, y1, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function draw(element, element2, index) {
  const line = document.createElement("div");
  const number = document.createElement("div");

  const length = getDistance(element.x, element2.x, element.y, element2.y);
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

const antAlgorithm = (
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
  }
  let bestPath = [];
  let bestDistance = Infinity;
  for (let ant = 0; ant < countOfAunts; ant++) {
    let path = antPaths[ant];
    let distance = 0;
    for (let i = 0; i < countOfCities; i++) {
      distance += distanceMatrix[path[i]][path[i + 1]];
    }
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPath = path;
    }
  }
  return {
    path: bestPath,
    distance: bestDistance,
  };
};

let points = [];
sheet.addEventListener("click", (event) => {
  const x =
    event.clientX -
    Math.ceil(event.currentTarget.getBoundingClientRect().x) +
    1;
  const y =
    event.clientY -
    Math.ceil(event.currentTarget.getBoundingClientRect().y) +
    1;
  const newPount = document.createElement("div");
  newPount.style.left = `${x}px`;
  newPount.style.top = `${y}px`;
  newPount.classList.add("ant-algorithm__point");
  sheet.append(newPount);
  points.push({ x: x, y: y });
});

start.addEventListener("click", () => {
  for (let i = 0; i < lines.length; ) {
    lines[i].remove();
  }
  for (let i = 0; i < numbers.length; ) {
    numbers[i].remove();
  }

  let matrix = [];

  points.forEach((element, index) => {
    matrix.push([]);
    points.forEach((elementTwo, indexTwo) => {
      matrix[index].push(
        getDistance(element.x, elementTwo.x, element.y, elementTwo.y)
      );
    });
  });
  const result = antAlgorithm(
    Number(countOfAunts.value),
    points.length,
    matrix,
    Number(alpha.value),
    Number(beta.value),
    Number(evaporationRate.value),
    Number(initialPheromone.value),
    Number(countOfIterations.value)
  );
  for (let i = 0; i < result.path.length - 1; i++) {
    draw(points[result.path[i]], points[result.path[i + 1]], i + 1);
  }
  resultElement.textContent = `${result.distance}`;
});
