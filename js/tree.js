var data,
  properties = {},
  root;
const inputFile = document.querySelector("#file");
const generateTreeButton = document.querySelector("#generateTree");
const isLoadedBlock = document.querySelector("#isLoaded");
const sheet = document.getElementsByClassName("tree__sheet")[0];
const panel = document.querySelector(".tree__panel");
const changeTreeButton = document.querySelector("#changeTree");
const htmlProperties = document.getElementsByClassName("tree__property");

inputFile.addEventListener("change", (event) => {
  isLoadedBlock.innerHTML = "Файл загружается";
  let file = event.target.files[0];
  let reader = new FileReader();
  if (file.name.split(".")[1] != "csv") {
    isLoadedBlock.innerHTML = "Вы можете загрузить только csv файл";
  } else {
    reader.readAsText(file);

    reader.onload = function () {
      console.log();
      data = reader.result;
      isLoadedBlock.innerHTML = "Файл загрузился";
    };

    reader.onerror = () => {
      isLoadedBlock.innerHTML = "Файл не смог загрузиться";
    };
  }
});

const convertData = (dataset) => {
  dataset = dataset
    .split("\r\n")
    .map((element) =>
      element.includes(";") ? element.split(";") : element.split(",")
    );
  const result = {};
  const header = dataset[0];

  for (let i = 0; i < header.length; i++) {
    const key = header[i];
    result[key] = [];
  }

  for (let i = 1; i < dataset.length; i++) {
    const row = dataset[i];
    for (let j = 0; j < row.length; j++) {
      const key = header[j];
      const value = row[j];
      if (isNaN(Number(value))) {
        result[key].push(value);
      } else {
        result[key].push(Number(value));
      }
    }
  }
  return result;
};

generateTreeButton.addEventListener("click", () => {
  if (!!data) {
    for (let i = 0; i < htmlProperties.length; ) {
      htmlProperties[i].remove();
    }
    console.log(sheet.children);
    if (!!sheet.children) {
      for (let i = 0; i < sheet.children.length; ) {
        sheet.children[i].remove();
      }
    }

    const info = convertData(data);
    let origin = { minVariants: Infinity, key: -1 };
    for (const key in info) {
      let countNow = Array.from(new Set(info[key])).length;
      if (countNow <= origin.minVariants) {
        origin.minVariants = countNow;
        origin.key = key;
      }
    }
    root = createTree(
      { child: [], value: Object.assign({}, info), property: origin.key },
      origin.key,
      info
    );
    createId([root], 0);
    drawNodes([root], origin.key);
    drawLines(root);
    drawPanel(info);
  } else {
    isLoadedBlock.innerHTML = "Пожалуйста загрузите файл";
  }
});

changeTreeButton.addEventListener("click", () => {
  drawSpecialNodes(root);
});

const getDistance = (firstElement, secondElement) =>
  Math.sqrt(
    Math.pow(firstElement.x - secondElement.x, 2) +
      Math.pow(firstElement.y - secondElement.y, 2)
  );

function drawLine(element, element2, property) {
  const line = document.createElement("div");
  const propertyElement = document.createElement("div");
  const length = getDistance(element, element2);
  let sin =
    (Math.asin(Math.abs(element.y - element2.y) / length) * 180) / Math.PI;
  let cos =
    (Math.acos(Math.abs(element.y - element2.y) / length) * 180) / Math.PI;

  if (element.x <= element2.x && element.y <= element2.y) {
    line.style.transform = `rotate(${sin}deg)`;
  } else if (element.x <= element2.x && element.y >= element2.y) {
    line.style.transform = `rotate(${360 - sin}deg)`;
  } else if (element.x >= element2.x && element.y >= element2.y) {
    line.style.transform = `rotate(${sin + 180}deg)`;
  } else {
    line.style.transform = `rotate(${cos + 90}deg)`;
  }

  propertyElement.innerHTML = property;
  propertyElement.style.left = `${
    element.x -
    element.width / 2 +
    (element2.x - element2.width / 2 - (element.x - element.width / 2)) / 2
  }px`;
  propertyElement.style.top = `${
    element.y + (element2.y - element.y) / 2 - 5
  }px`;
  propertyElement.classList.add("tree__info");

  line.style.width = `${length}px`;
  line.style.left = `${element.x}px`;
  line.style.top = `${element.y}px`;
  line.classList.add("tree__line");

  sheet.append(line);
  sheet.append(propertyElement);
}
const drawLines = (node) => {
  const firstElement = document.getElementById(node.id);
  const firstElementCoords = {
    x:
      firstElement.getBoundingClientRect().x +
      firstElement.getBoundingClientRect().width / 2 -
      sheet.getBoundingClientRect().x,
    y:
      firstElement.getBoundingClientRect().y +
      +firstElement.getBoundingClientRect().height / 2 -
      sheet.getBoundingClientRect().y,
    width: firstElement.getBoundingClientRect().width,
  };
  for (const secondNode of node.child) {
    const secondElement = document.getElementById(secondNode.id);
    const secondElementCoords = {
      x:
        secondElement.getBoundingClientRect().x +
        secondElement.getBoundingClientRect().width / 2 -
        sheet.getBoundingClientRect().x,
      y:
        secondElement.getBoundingClientRect().y -
        sheet.getBoundingClientRect().y,
      width: secondElement.getBoundingClientRect().width,
    };
    drawLine(firstElementCoords, secondElementCoords, secondNode.property);
    if (!!secondNode.child.length) drawLines(secondNode);
  }
};

const drawSpecialNodes = (node) => {
  first: for (const key in properties) {
    for (const element of node.child) {
      if (key + properties[key].value == element.property) {
        const htmlElement = document.getElementById(element.id);
        htmlElement.style.backgroundColor = "red";
        drawSpecialNodes(element);
        break first;
      }
    }
  }
};
const createId = (nodes, lastIndex) => {
  let newNodes = [];
  for (const node of nodes) {
    node.id = lastIndex++;
    newNodes.push(...node.child);
  }
  if (!!newNodes.length) createId(newNodes, lastIndex);
};

const drawPanel = (info) => {
  properties = {};
  for (const key in info) {
    const property = document.createElement("div");
    property.classList.add("tree__property");
    const propertyLabel = document.createElement("label");
    const propertyInput = document.createElement("input");
    propertyInput.setAttribute("id", key);
    propertyLabel.innerHTML = key;
    property.append(propertyLabel);
    property.append(propertyInput);
    panel.prepend(property);
    properties[key] = document.getElementById(key);
  }
};

const drawNodes = (level, originKey) => {
  let newLevel = [];
  const htmlLevel = document.createElement("div");
  htmlLevel.classList.add("tree__level");
  for (const node of level) {
    const nodeElement = document.createElement("div");
    nodeElement.classList.add("tree__element");
    nodeElement.setAttribute("id", node.id);
    let variants = {};
    for (const value of node.value[originKey]) {
      if (!variants.hasOwnProperty(value)) variants[value] = 0;
    }
    node.value[originKey].forEach((element) => {
      variants[element] += 1;
    });

    nodeElement.append(
      (document.createElement("span").innerHTML = `${originKey}`)
    );
    for (const key in variants) {
      const value = document.createElement("span");
      value.innerHTML = `${key}: ${variants[key]}`;
      nodeElement.append(value);
    }

    htmlLevel.append(nodeElement);
    newLevel.push(...node.child);
  }
  sheet.append(htmlLevel);
  if (!!newLevel.length) drawNodes(newLevel, originKey);
};

const getEntropyForNumbers = (
  info,
  originData,
  key,
  property,
  originEntropy
) => {
  let first = { variants: {}, entropy: 0 };
  let second = { variants: {}, entropy: 0 };
  for (const value of info[originData]) {
    if (!first.variants.hasOwnProperty(value)) first.variants[value] = 0;
    if (!second.variants.hasOwnProperty(value)) second.variants[value] = 0;
  }
  first.variants.sum = 0;
  second.variants.sum = 0;
  info[key].forEach((element, index) => {
    if (element <= property) {
      first.variants[info[originData][index]] += 1;
      first.variants.sum += 1;
    } else {
      second.variants[info[originData][index]] += 1;
      second.variants.sum += 1;
    }
  });

  for (const value in first.variants) {
    if (first.variants[value] != 0) {
      first.entropy -=
        (first.variants[value] / first.variants.sum) *
        (Math.log(first.variants[value] / first.variants.sum) / Math.log(2));
    }
    if (second.variants[value] != 0) {
      second.entropy -=
        (second.variants[value] / second.variants.sum) *
        (Math.log(second.variants[value] / second.variants.sum) / Math.log(2));
    }
  }
  originEntropy =
    originEntropy -
    (first.variants.sum / info[originData].length) * first.entropy -
    (second.variants.sum / info[originData].length) * second.entropy;
  return originEntropy;
};

const getEntropy = (info, originData, key = "", property = "") => {
  let variants = {},
    entropy = 0;

  variants.sum = 0;
  if (!!property) {
    for (const value of info[originData]) {
      if (!variants.hasOwnProperty(value)) variants[value] = 0;
    }
    info[key].forEach((element, index) => {
      if (property == element) {
        variants[info[originData][index]] += 1;
        variants.sum += 1;
      }
    });
  } else {
    for (const value of info[originData]) {
      if (!variants.hasOwnProperty(value)) variants[value] = 0;
      variants[value] += 1;
      variants.sum += 1;
    }
  }

  for (const value in variants) {
    if (variants[value] == 0) continue;
    entropy -=
      (variants[value] / variants.sum) *
      (Math.log(variants[value] / variants.sum) / Math.log(2));
  }
  return { entropy: entropy, count: variants.sum };
};

const createTree = (node, originData, info) => {
  let { entropy, count } = getEntropy(info, originData);

  let bestEntropy = 0,
    bestKey,
    bestValue;

  for (const key in info) {
    if (originData == key) continue;
    if (typeof info[key][0] == "number") {
      Array.from(new Set(info[key])).forEach((element, index) => {
        let entropyNow = getEntropyForNumbers(
          info,
          originData,
          key,
          element,
          entropy
        );
        if (entropyNow >= bestEntropy) {
          bestEntropy = entropyNow;
          bestKey = key;
          bestValue = element;
        }
      });
    } else {
      let temp = entropy;
      Array.from(new Set(info[key])).forEach((element, index) => {
        let entropyNow = getEntropy(info, originData, key, element);
        temp -= entropyNow.entropy * (entropyNow.count / count);
      });

      if (temp >= bestEntropy) {
        bestEntropy = temp;
        bestKey = key;
      }
    }
  }

  if (typeof info[bestKey][0] == "number") {
    for (let i = 0; i < 2; i++) {
      let newInfo = {};
      for (const key in info) {
        newInfo[key] = Array(0);
      }
      info[bestKey].forEach((element, index) => {
        if (
          (i == 0 && element <= bestValue) ||
          (i == 1 && element > bestValue)
        ) {
          for (const key in info) {
            newInfo[key].push(info[key][index]);
          }
        }
      });
      if (Array.from(new Set(newInfo[originData])).length > 1) {
        node.child.push(
          createTree(
            {
              child: [],
              value: Object.assign({}, newInfo),
              property:
                i == 0 ? `${bestKey}<=${bestValue}` : `${bestKey}>${bestValue}`,
            },
            originData,
            newInfo
          )
        );
      } else
        node.child.push({
          child: [],
          value: Object.assign({}, newInfo),
          property:
            i == 0 ? `${bestKey}<=${bestValue}` : `${bestKey}>${bestValue}`,
        });
    }
  } else {
    let uniqueElements = new Set(info[bestKey]);
    uniqueElements.forEach((value) => {
      let newInfo = {};
      for (const key in info) {
        newInfo[key] = Array(0);
      }
      info[bestKey].forEach((element, index) => {
        if (element == value) {
          for (const key in info) {
            newInfo[key].push(info[key][index]);
          }
        }
      });
      if (Array.from(new Set(newInfo[originData])).length > 1) {
        node.child.push(
          createTree(
            {
              child: [],
              value: Object.assign({}, newInfo),
              property: `${bestKey}=${value}`,
            },
            originData,
            newInfo
          )
        );
      } else
        node.child.push({
          child: [],
          value: Object.assign({}, newInfo),
          property: `${bestKey}=${value}`,
        });
    });
  }
  return node;
};
