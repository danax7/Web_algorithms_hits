import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState } from "react";

// Базовый вариант - ваше приложение позволяет сгенерировать квадратную карту размером n*n, настроить эту карту, разместив на ней непроходимые клетки, клетку начала и конца пути. Далее при запуске алгоритма по одной эвристике показывается найденный маршрут или выводится, что маршрута не существует.
// Бонусный вариант - вы генерируете карту-лабиринт (можно использовать алгоритмы генерации лабиринтов на основе алгоритмов Прима/Краскала) на карте размером n*n, вы позволяете пользователю модернизировать этот лабиринт, добавив/убавив непроходимые клетки, клетку начала и конца пути. Далее при запуске отрисовывается анимация поиска и прохождения пути на каждой итерации алгоритма (вы показываете, какие клетки рассматриваются алгоритмом, какие выбраны и какие анализируются для построения маршрута) в режиме реального времени.
const A_star = () => {
  const [n, setN] = useState(0);
  const [start, setStart] = useState(0);
  const [finish, setFinish] = useState(0);
  const [walls, setWalls] = useState([]);
  const [map, setMap] = useState([]);
  const [path, setPath] = useState([]);
  const [isPathFound, setIsPathFound] = useState(false);
  const [isPathNotFound, setIsPathNotFound] = useState(false);
  const [isMapGenerated, setIsMapGenerated] = useState(false);

  const generateMap = () => {
    const map = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(0);
      }
      map.push(row);
    }
    setMap(map);
    setIsMapGenerated(true);
  };

  const generateWalls = () => {
    const map = [...this.state.map];
    for (let i = 0; i < walls.length; i++) {
      const [x, y] = walls[i];
      map[x][y] = 1;
    }
    setMap(map);
  };

  const generateStart = () => {
    const map = [...this.state.map];
    const [x, y] = start;
    map[x][y] = 2;
    setMap(map);
  };

  const generateFinish = () => {
    const map = [...this.state.map];
    const [x, y] = finish;
    map[x][y] = 3;
    setMap(map);
  };

  const generatePath = () => {
    const map = [...this.state.map];
    for (let i = 0; i < path.length; i++) {
      const [x, y] = path[i];
      map[x][y] = 4;
    }
    setMap(map);
  };

  const generateAll = () => {
    generateWalls();
    generateStart();
    generateFinish();
    generatePath();
  };

  const findPath = () => {
    const map = [...this.state.map];
    const start = [...this.state.start];
    const finish = [...this.state.finish];
    const path = [];
    const visited = [];
    const queue = [];
    const parents = [];
    const g = [];
    const f = [];
    const h = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(0);
      }
      visited.push(row);
      parents.push(row);
      g.push(row);
      f.push(row);
      h.push(row);
    }
    queue.push(start);
    visited[start[0]][start[1]] = 1;
    g[start[0]][start[1]] = 0;
    h[start[0]][start[1]] =
      Math.abs(start[0] - finish[0]) + Math.abs(start[1] - finish[1]);
    f[start[0]][start[1]] = g[start[0]][start[1]] + h[start[0]][start[1]];
    while (queue.length > 0) {
      let min = 0;
      for (let i = 0; i < queue.length; i++) {
        if (f[queue[i][0]][queue[i][1]] < f[queue[min][0]][queue[min][1]]) {
          min = i;
        }
      }
      const [x, y] = queue[min];
      queue.splice(min, 1);
      if (x === finish[0] && y === finish[1]) {
        let current = finish;
        while (current[0] !== start[0] || current[1] !== start[1]) {
          path.push(current);
          current = parents[current[0]][current[1]];
        }
        path.push(start);
        path.reverse();
        setPath(path);
        setIsPathFound(true);
        return;
      }
      const neighbours = [];
      if (x > 0) {
        neighbours.push([x - 1, y]);
      }
      if (x < n - 1) {
        neighbours.push([x + 1, y]);
      }
      if (y > 0) {
        neighbours.push([x, y - 1]);
      }
      if (y < n - 1) {
        neighbours.push([x, y + 1]);
      }
      for (let i = 0; i < neighbours.length; i++) {
        const [x, y] = neighbours[i];
        if (visited[x][y] === 0 && map[x][y] !== 1) {
          queue.push(neighbours[i]);
          visited[x][y] = 1;
          parents[x][y] = [x, y];
          g[x][y] = g[parents[x][y][0]][parents[x][y][1]] + 1;
          h[x][y] = Math.abs(x - finish[0]) + Math.abs(y - finish[1]);
          f[x][y] = g[x][y] + h[x][y];
        }
      }
    }
    setIsPathNotFound(true);
  };

  const handleNChange = (event) => {
    setN(event.target.value);
  };

  const handleStartChange = (event) => {
    const [x, y] = event.target.value.split(",");
    setStart([x, y]);
  };

  const handleFinishChange = (event) => {
    const [x, y] = event.target.value.split(",");
    setFinish([x, y]);
  };

  const handleWallsChange = (event) => {
    const walls = [];
    const wallsString = event.target.value.split(";");
    for (let i = 0; i < wallsString.length; i++) {
      const [x, y] = wallsString[i].split(",");
      walls.push([x, y]);
    }
    setWalls(walls);
  };

  const handleGenerateMap = () => {
    generateMap();
  };

  const handleGenerateAll = () => {
    generateAll();
  };

  const handleFindPath = () => {
    findPath();
  };

  const handleReset = () => {
    setN(0);
    setStart([]);
    setFinish([]);
    setWalls([]);
    setPath([]);
    setIsPathFound(false);
    setIsPathNotFound(false);
    setIsMapGenerated(false);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Pathfinding Visualizer</h1>
      </div>
      <div className="App-body">
        <div className="App-body-left">
          <div className="App-body-left-input">
            <label>N: </label>
            <input type="number" value={n} onChange={handleNChange} />
          </div>
          <div className="App-body-left-input">
            <label>Start: </label>
            <input type="text" value={start} onChange={handleStartChange} />
          </div>
          <div className="App-body-left-input">
            <label>Finish: </label>
            <input type="text" value={finish} onChange={handleFinishChange} />
          </div>
          <div className="App-body-left-input">
            <label>Walls: </label>
            <input type="text" value={walls} onChange={handleWallsChange} />
          </div>
          <div className="App-body-left-input">
            <button onClick={handleGenerateMap}>Generate Map</button>
          </div>
          <div className="App-body-left-input">
            <button onClick={handleGenerateAll}>Generate All</button>
          </div>
          <div className="App-body-left-input">
            <button onClick={handleFindPath}>Find Path</button>
          </div>
          <div className="App-body-left-input">
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
        <div className="App-body-right">
          <div className="App-body-right-map">
            <Map
              n={n}
              start={start}
              finish={finish}
              walls={walls}
              path={path}
              isPathFound={isPathFound}
              isPathNotFound={isPathNotFound}
              isMapGenerated={isMapGenerated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default A_star;
