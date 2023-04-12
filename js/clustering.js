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
        if (
          getDistance(element.x, element2.x, element.y, element2.y) <
          minDistance
        ) {
          minDistance = getDistance(
            element.x,
            element2.x,
            element.y,
            element2.y
          );
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

function getDistance(x1, x2, y1, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

const kMeansPlus = (klasters, points) => {
  debugger;
  let groups = Array(klasters.length).fill(Array(0));
  let minElement = 0,
    oldDistance = 160000;
  while (true) {
    let newGroups = Array(klasters.length).fill(Array(0));
    points.forEach((element, index) => {
      minElement = 0;
      oldDistance = 160000;
      klasters.forEach((element2, index2) => {
        if (
          getDistance(element.x, element2.x, element.y, element2.y) <
          oldDistance
        ) {
          minElement = index2;
          oldDistance = getDistance(
            element.x,
            element2.x,
            element.y,
            element2.y
          );
        }
      });
      newGroups[minElement] = [
        ...newGroups[minElement],
        Object.assign({}, element),
      ];
    });
    if (JSON.stringify(groups) == JSON.stringify(newGroups)) break;
    groups = newGroups.slice(0);
    klasters = klasters.map((element, index) => {
      element.x = 0;
      element.y = 0;
      newGroups[index].forEach((element2) => {
        element.x += element2.x;
        element.y += element2.y;
      });
      return {
        x: element.x / newGroups[index].length,
        y: element.y / newGroups[index].length,
      };
    });
    debugger;
  }
  return groups;
};

const DBSCAN = (points, radius, minNumber) => {
  let groups = points.map((element, index) => {
    return { x: element.x, y: element.y, claster: index };
  });
  let indexes = [];
  points.forEach((element, index) => {
    points.forEach((element2, index2) => {
      if (getDistance(element.x, element2.x, element.y, element2.y) <= radius) {
        indexes.push(index2);
      }
    });
    if (indexes.length >= minNumber) {
      indexes.forEach((element2) => {
        groups[element2].claster = index;
      });
    }
    indexes.length = 0;
  });

  let newGroups = Array(0),
    lastIndex = 0;
  groups.forEach((element, index) => {
    newGroups[lastIndex] = [];
    groups.forEach((element2, index2) => {
      if (element2.claster == index)
        newGroups[lastIndex].push({
          x: element2.x,
          y: element2.y,
        });
    });
    if (newGroups[lastIndex].length <= 1) newGroups[lastIndex].length = 0;
    else lastIndex++;
  });

  if (!newGroups[newGroups.length - 1].length) newGroups.length--;
  return newGroups;
};

//параметры
const countOfClasters = document.getElementById("countOfClasters");
const radius = document.getElementById("radius");
const minCountOfNumbers = document.getElementById("minCountOfNumbers");
//кнопки, точки и поля
const sheet = document.querySelector(".clustering__sheet");
const kMiddleButton = document.querySelector("#kMiddle");
const DBSCANButton = document.querySelector("#DBSCAN");
const clearButton = document.querySelector("#clearPoints");
const collecionOfPoints = document.getElementsByClassName("clustering__point");
const COLORS = ["red", "green", "blue"];
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
  newPount.classList.add("clustering__point");
  sheet.append(newPount);
  points.push({ x: x, y: y });
});

kMiddleButton.addEventListener("click", (event) => {
  const groups = kMeansPlus(
    getClastersPlus(points, Number(countOfClasters.value)),
    points
  );
  console.log(groups);
  for (let i = 0; i < collecionOfPoints.length; ) {
    collecionOfPoints[i].remove();
  }

  for (const index in groups) {
    for (const element of groups[index]) {
      const newPount = document.createElement("div");
      newPount.style.left = `${element.x}px`;
      newPount.style.top = `${element.y}px`;
      newPount.style.backgroundColor = COLORS[index];
      newPount.classList.add("clustering__point");
      sheet.append(newPount);
    }
  }
});

DBSCANButton.addEventListener("click", (event) => {
  const groups = DBSCAN(
    points,
    Number(radius.value),
    Number(minCountOfNumbers.value)
  );
  for (let i = 0; i < collecionOfPoints.length; ) {
    collecionOfPoints[i].remove();
  }

  for (const index in groups) {
    for (const element of groups[index]) {
      const newPount = document.createElement("div");
      newPount.style.left = `${element.x}px`;
      newPount.style.top = `${element.y}px`;
      newPount.style.backgroundColor = COLORS[index];
      newPount.classList.add("clustering__point");
      sheet.append(newPount);
    }
  }
});

clearButton.addEventListener("click", () => {
  points.length = 0;
  for (let i = 0; i < collecionOfPoints.length; ) {
    collecionOfPoints[i].remove();
  }
});
