import React from "react";
import Cell from "../Cell/Cell";

class Maze extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maze: [], // двумерный массив клеток
      start: null, // координаты стартовой клетки
      end: null, // координаты конечной клетки
    };
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  componentDidMount() {
    const maze = this.generateMaze();
    const start = [0, 0]; // начальная клетка
    const end = [maze.length - 1, maze[0].length - 1]; // конечная клетка
    this.setState({ maze, start, end });
  }

  // генерация карты-лабиринта
  generateMaze() {
    const n = 10; // размер лабиринта
    const maze = [];
    for (let i = 0; i < n; i++) {
      maze.push([]);
      for (let j = 0; j < n; j++) {
        maze[i].push(false); // все клетки закрыты
      }
    }
    return maze;
  }

  // обработка клика на клетке
  handleCellClick(x, y) {
    const { maze } = this.state;
    maze[x][y] = !maze[x][y]; // изменение состояния клетки
    this.setState({ maze });
  }

  // отображение всех клеток
  renderCells() {
    const { maze } = this.state;
    const size = 30; // размер клетки в пикселях
    const cells = [];
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        cells.push(
          <Cell
            key={`${i}-${j}`}
            isOpen={maze[i][j]}
            size={size}
            onClick={() => this.handleCellClick(i, j)}
          />
        );
      }
    }
    return cells;
  }

  render() {
    return <div className="maze">{this.renderCells()}</div>;
  }
}

export default Maze;
