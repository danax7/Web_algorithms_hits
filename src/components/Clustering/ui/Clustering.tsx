import { useMemo, useState } from "react";
import Point from "../../Point/ui/Point";
import { getClaster } from "../helpers/getClaster";
import { kMiddle } from "../helpers/kMiddle";
import "./style.scss";

const Clustering = () => {
  const [x, setX] = useState<number[]>([]);
  const [y, setY] = useState<number[]>([]);
  const COUNT_OF_CLASTERS = 3;
  const COLORS = ["blue", "red", "green"];

  const [answer, setAnswer] = useState<{ x: number; y: number }[][]>(
    Array(COUNT_OF_CLASTERS).fill(Array(0))
  );

  return (
    <div className="clustering">
      <div
        onClick={(event) => {
          let temp: number =
            event.clientX -
            Math.ceil(event.currentTarget.getBoundingClientRect().x) +
            1;
          setX((prevX) => [...prevX, temp]);
          let temp2 =
            event.clientY -
            Math.ceil(event.currentTarget.getBoundingClientRect().y) +
            1;
          setY((prevY) => [...prevY, temp2]);
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
          : x.map((element, index) => (
              <Point left={element} top={y[index]} color={"white"} />
            ))}
      </div>
      <button onClick={() => console.log(x, y)}>apfkAWKFPAW</button>
      <button
        onClick={() => {
          const newAnswer = kMiddle(getClaster(COUNT_OF_CLASTERS), x, y);
          console.log(newAnswer);
          setAnswer(newAnswer);
        }}
      >
        kMiddle
      </button>
    </div>
  );
};

export default Clustering;
