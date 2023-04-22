const getDistance = (firstElement, secondElement) =>
  Math.sqrt(
    Math.pow(firstElement.x - secondElement.x, 2) +
      Math.pow(firstElement.y - secondElement.y, 2)
  );

const getClastersPlus = (points, countOfClasters) => {
  klasters = [
    Object.assign({}, points[Math.floor(Math.random() * (points.length - 1))]),
  ];
  let nextKlaster = { maxDistance: -1, indexOfPoint: -1 };
  let minDistance;
  while (klasters.length < countOfClasters) {
    nextKlaster = { maxDistance: -1, indexOfPoint: -1 };
    points.forEach((element, index) => {
      minDistance = Infinity;
      klasters.forEach((element2, index2) => {
        if (getDistance(element, element2) < minDistance) {
          minDistance = getDistance(element, element2);
        }
      });
      if (minDistance > nextKlaster.maxDistance) {
        nextKlaster.maxDistance = minDistance;
        nextKlaster.indexOfPoint = index;
      }
    });
    klasters.push(Object.assign({}, points[nextKlaster.indexOfPoint]));
  }
  return klasters;
};

const kMeansPlus = (klasters, points) => {
  let groups = Array(klasters.length).fill(Array(0));
  let minElement = 0,
    oldDistance = 160000;
  while (true) {
    let newGroups = Array(klasters.length).fill(Array(0));
    points.forEach((element, index) => {
      minElement = 0;
      oldDistance = 160000;
      klasters.forEach((element2, index2) => {
        if (getDistance(element, element2) < oldDistance) {
          minElement = index2;
          oldDistance = getDistance(element, element2);
        }
      });
      newGroups[minElement] = [...newGroups[minElement], index];
    });
    if (JSON.stringify(groups) == JSON.stringify(newGroups)) break;
    groups = newGroups.slice(0);
    klasters = klasters.map((element, index) => {
      element.x = 0;
      element.y = 0;
      newGroups[index].forEach((element2) => {
        element.x += points[element2].x;
        element.y += points[element2].y;
      });
      return {
        x: element.x / newGroups[index].length,
        y: element.y / newGroups[index].length,
      };
    });
  }
  return groups;
};

const DBSCAN = (points, radius, minNumber) => {
  let clustersOfPoints = points.map(() => {
    -1;
  });
  let indexes = [];
  points.forEach((element, index) => {
    points.forEach((element2, index2) => {
      if (getDistance(element, element2) <= radius) {
        indexes.push(index2);
      }
    });
    if (indexes.length >= minNumber) {
      indexes.forEach((element2) => {
        clustersOfPoints[element2] = index;
      });
    }
    indexes.length = 0;
  });

  let groups = Array(0),
    lastIndex = 0;
  clustersOfPoints.forEach((element, index) => {
    groups[lastIndex] = [];
    clustersOfPoints.forEach((element2, index2) => {
      if (element2 == index) groups[lastIndex].push(index2);
    });
    if (groups[lastIndex].length != 0) lastIndex++;
  });

  if (!groups[groups.length - 1].length) groups.length--;
  return groups;
};

const hierarchical = (points, countOfClasters) => {
  let groups = points.map((element, index) => {
    return [index];
  });
  let countOfClastersNow = points.length;
  let nextSwap = { firstElement: -1, secondElement: -1, minDistance: Infinity };
  while (countOfClastersNow > countOfClasters) {
    nextSwap = { firstElement: -1, secondElement: -1, minDistance: Infinity };
    groups.forEach((element, index) => {
      groups.forEach((element2, index2) => {
        if (index < index2) {
          //поиск средней точки
          let middleOfFirstGroup = { x: 0, y: 0 },
            middleOfSecondGroup = { x: 0, y: 0 };
          element.forEach((indexOfPoint) => {
            middleOfFirstGroup.x += points[indexOfPoint].x;
            middleOfFirstGroup.y += points[indexOfPoint].y;
          });
          element2.forEach((indexOfPoint) => {
            middleOfSecondGroup.x += points[indexOfPoint].x;
            middleOfSecondGroup.y += points[indexOfPoint].y;
          });

          middleOfFirstGroup.x /= element.length;
          middleOfFirstGroup.y /= element.length;

          middleOfSecondGroup.x /= element2.length;
          middleOfSecondGroup.y /= element2.length;

          //вычисление максимальной дистанции
          if (
            getDistance(middleOfFirstGroup, middleOfSecondGroup) <
            nextSwap.minDistance
          ) {
            nextSwap.firstElement = index;
            nextSwap.secondElement = index2;
            nextSwap.minDistance = getDistance(
              middleOfFirstGroup,
              middleOfSecondGroup
            );
          }
        }
      });
    });
    groups[nextSwap.firstElement].push(...groups[nextSwap.secondElement]);
    groups[nextSwap.secondElement].length = 0;
    countOfClastersNow--;
  }
  let newGroups = [];
  groups.forEach((element) => {
    if (element.length) newGroups.push(element);
  });
  return newGroups;
};

//параметры
const countOfClasters = document.getElementById("countOfClasters");
const radius = document.getElementById("radius");
const minCountOfNumbers = document.getElementById("minCountOfNumbers");
//кнопки, точки и поля
const sheet = document.querySelector(".clustering__sheet");
const kMeansButton = document.querySelector("#kMeans");
const DBSCANButton = document.querySelector("#DBSCAN");
const hierarchicalButton = document.querySelector("#hierarchical");
const clearButton = document.querySelector("#clearPoints");
const comparisonButton = document.querySelector("#comparison");
const collecionOfPoints = document.getElementsByClassName("clustering__point");

const COLORS = [...Array(10)].map(
  (element) =>
    `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
);
let points = [];
let isTogether = false;
let resultsOfAlgorithms = {};

comparisonButton.addEventListener("click", () => {
  isTogether = !isTogether;
});

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
    newPount.classList.add("clustering__point");
    sheet.append(newPount);
    points.push({ x: x, y: y });
  }
});

const drawPoints = (groups) => {
  for (let i = 0; i < collecionOfPoints.length; ) {
    collecionOfPoints[i].remove();
  }
  if (!isTogether) {
    for (const index in groups) {
      for (const element of groups[index]) {
        const newPoint = document.createElement("div");
        newPoint.style.left = `${points[element].x}px`;
        newPoint.style.top = `${points[element].y}px`;
        newPoint.style.backgroundColor = COLORS[index];
        newPoint.classList.add("clustering__point");
        sheet.append(newPoint);
      }
    }
  } else {
    let pointsWithClasters = Array(points.length);
    Object.keys(resultsOfAlgorithms).forEach((key) => {
      resultsOfAlgorithms[key].forEach((group, indexOfGroup) => {
        group.forEach((element) => {
          if (!pointsWithClasters[element])
            pointsWithClasters[element] = new Object();
          pointsWithClasters[element][key] = indexOfGroup;
        });
      });
    });
    for (let index = 0; index < pointsWithClasters.length; index++) {
      const newPoint = document.createElement("div");
      newPoint.style.left = `${points[index].x}px`;
      newPoint.style.top = `${points[index].y}px`;
      newPoint.classList.add("clustering__point");
      for (const claster in pointsWithClasters[index]) {
        const newType = document.createElement("div");
        newType.style.backgroundColor =
          COLORS[pointsWithClasters[index][claster]];
        newPoint.append(newType);
      }
      sheet.append(newPoint);
    }
  }
};

kMeansButton.addEventListener("click", () => {
  const groups = kMeansPlus(
    getClastersPlus(points, Number(countOfClasters.value)),
    points
  );
  if (isTogether) resultsOfAlgorithms.kMeans = groups;
  drawPoints(groups);
});

DBSCANButton.addEventListener("click", () => {
  const groups = DBSCAN(
    points,
    Number(radius.value),
    Number(minCountOfNumbers.value)
  );
  if (isTogether) resultsOfAlgorithms.DBSCAN = groups;
  drawPoints(groups);
});

hierarchicalButton.addEventListener("click", () => {
  const groups = hierarchical(points, Number(countOfClasters.value));
  if (isTogether) resultsOfAlgorithms.hierarchical = groups;
  drawPoints(groups);
});

clearButton.addEventListener("click", () => {
  points.length = 0;
  for (let i = 0; i < collecionOfPoints.length; ) {
    collecionOfPoints[i].remove();
  }
});
