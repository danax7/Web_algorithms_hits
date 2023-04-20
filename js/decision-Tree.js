function convertData(dataset) {
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
      result[key].push(value);
    }
  }
  return result;
}

var dataset = [
  ["age", "api_hi", "false"],
  ["50", "110", " true"],
  ["55", "140", "true"],
  ["52", "130", " true"],
  ["48", "100", "false"],
];

var Dataset = [
  ["outlook", "temperature", "humidity", "windy", "play"],
  ["overcast", "hot", "high", "FALSE", "yes"],
  ["overcast", "cool", "normal", "TRUE", "yes"],
  ["overcast", "mild", "high", "TRUE", "yes"],
  ["overcast", "hot", "normal", "FALSE", "yes"],
  ["rainy", "mild", "high", "FALSE", "yes"],
  ["rainy", "cool", "normal", "FALSE", "yes"],
  ["rainy", "cool", "normal", "TRUE", "no"],
  ["rainy", "mild", "normal", "FALSE", "yes"],
  ["rainy", "mild", "high", "TRUE", "no"],
  ["sunny", "hot", "high", "FALSE", "no"],
  ["sunny", "hot", "high", "TRUE", "no"],
  ["sunny", "mild", "high", "FALSE", "no"],
  ["sunny", "cool", "normal", "FALSE", "yes"],
  ["sunny", "mild", "normal", "TRUE", "yes"],
];

console.log(convertData(Dataset));
