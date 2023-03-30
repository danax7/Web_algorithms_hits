import { useMemo, useState } from "react";
import Point from "../../Point/ui/Point";
import { DBSCAN } from "../helpers/DBSCAN";
import { getClaster } from "../helpers/getClaster";
import { hierarchical } from "../helpers/hierarchical";
import { kMiddle } from "../helpers/kMiddle";
import { IPoint } from "../types/Point";
import "./style.scss";

const Clustering = () => {
  const [points, setPoints] = useState<IPoint[]>([]);
  const COUNT_OF_CLASTERS = 3;
  const COLORS = ["blue", "red", "green"];

  const [kMiddleELements, setKMiddleELements] = useState<IPoint[][]>(
    Array(COUNT_OF_CLASTERS).fill(Array(0))
  );

  const [hierarchicalElements, setHierarchicalElements] = useState<IPoint[][]>(
    Array(COUNT_OF_CLASTERS).fill(Array(0))
  );

  const [DBSCANElements, setDBSCANElements] = useState<IPoint[][]>(
    Array(COUNT_OF_CLASTERS).fill(Array(0))
  );

  return (
    <div className="clustering">
      <div
        onClick={(event) => {
          let temp: IPoint = {
            x:
              event.clientX -
              Math.ceil(event.currentTarget.getBoundingClientRect().x) +
              1,
            y:
              event.clientY -
              Math.ceil(event.currentTarget.getBoundingClientRect().y) +
              1,
          };
          setPoints((prevPoints) => [...prevPoints, temp]);
        }}
        className="clustering__plane"
      >
        {/* {kMiddleELements[0].length != 0
          ? kMiddleELements.map((element, index) =>
              element.map((element2) => (
                <Point
                  left={element2.x}
                  top={element2.y}
                  color={COLORS[index]}
                />
              ))
            )
          : points.map((element, index) => (
              <Point left={element.x} top={element.y} color={"white"} />
            ))}

        {hierarchicalElements[0].length != 0
          ? hierarchicalElements.map((element, index) =>
              element.map((element2) => (
                <Point
                  left={element2.x}
                  top={element2.y}
                  color={COLORS[index]}
                />
              ))
            )
          : points.map((element, index) => (
              <Point left={element.x} top={element.y} color={"white"} />
            ))} */}
        {DBSCANElements[0].length != 0
          ? DBSCANElements.map((element, index) =>
              element.map((element2) => (
                <Point
                  left={element2.x}
                  top={element2.y}
                  color={COLORS[index]}
                />
              ))
            )
          : points.map((element, index) => (
              <Point left={element.x} top={element.y} color={"white"} />
            ))}
      </div>
      <button
        onClick={() => {
          setKMiddleELements(Array(COUNT_OF_CLASTERS).fill(Array(0)));
          setHierarchicalElements(Array(COUNT_OF_CLASTERS).fill(Array(0)));
          setDBSCANElements(Array(COUNT_OF_CLASTERS).fill(Array(0)));
          setPoints([]);
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          const newAnswer = kMiddle(getClaster(COUNT_OF_CLASTERS), points);
          setKMiddleELements(newAnswer);
        }}
      >
        kMiddle
      </button>
      <button
        onClick={() => {
          const newAnswer = hierarchical(points, COUNT_OF_CLASTERS);
          setHierarchicalElements(newAnswer);
        }}
      >
        test
      </button>
      <div className="panelDBSCAN">
        <input type="text" />
        <input type="text" />
        <button
          onClick={() => {
            const newAnswer = DBSCAN(points, 20, 3);
            console.log(newAnswer);
            setDBSCANElements(newAnswer);
          }}
        >
          GO
        </button>
      </div>
    </div>
  );
};

export default Clustering;
