import { useMemo, useState } from "react";
import Point from "../../Point/ui/Point";
import { getClaster } from "../helpers/getClaster";
import { kMiddle } from "../helpers/kMiddle";
import { IPoint } from "../types/Point";
import "./style.scss";

const Clustering = () => {
  const [points, setPoints] = useState<IPoint[]>([]);
  const COUNT_OF_CLASTERS = 3;
  const COLORS = ["blue", "red", "green"];

  const [answer, setAnswer] = useState<IPoint[][]>(
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
        {answer[0].length != 0
          ? answer.map((element, index) =>
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
          setAnswer(Array(COUNT_OF_CLASTERS).fill(Array(0)));
          setPoints([]);
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          const newAnswer = kMiddle(getClaster(COUNT_OF_CLASTERS), points);
          setAnswer(newAnswer);
        }}
      >
        kMiddle
      </button>
    </div>
  );
};

export default Clustering;
