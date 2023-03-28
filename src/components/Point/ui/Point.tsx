import { IPoint } from "../types/Position";
import { CSSProperties } from "react";
const Point = (props: IPoint) => {
  const pointStyle: CSSProperties = {
    position: "absolute",
    backgroundColor: `${props.color}`,
    left: `${props.left}px`,
    top: `${props.top}px`,
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  };
  return <div style={pointStyle}></div>;
};
export default Point;
