import React from "react";

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false, // начальное состояние клетки - закрыто
    };
    this.toggleCell = this.toggleCell.bind(this);
  }

  toggleCell() {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { isOpen } = this.state;
    const { size } = this.props;
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: isOpen ? "#fff" : "#000",
      border: "1px solid #ccc",
    };

    return <div className="cell" style={style} onClick={this.toggleCell} />;
  }
}

export default Cell;
