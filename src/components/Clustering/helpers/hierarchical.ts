import { IPoint } from "../types/Point";

function getDistace(x1: number, x2: number, y1: number, y2: number) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function hierarchical(points: IPoint[], countOfClasters: number) {
  let groups: IPoint[][] = points.map((element) => [element]);
  let count = groups.length;
  let distance = 160000,
    minElement = 0;
  while (count > countOfClasters) {
    groups.forEach((element, index) => {
      if (!!element.length && count > countOfClasters) {
        let firstCenter: IPoint = { x: 0, y: 0 };
        (distance = 160000), (minElement = 0);
        element.forEach((point) => {
          firstCenter.x += point.x;
          firstCenter.y += point.y;
        });
        firstCenter.x /= element.length;
        firstCenter.y /= element.length;
        groups.forEach((element2, index2) => {
          if (index2 > index && !!element2.length && count > countOfClasters) {
            let secondCenter: IPoint = { x: 0, y: 0 };
            element.forEach((point) => {
              secondCenter.x += point.x;
              secondCenter.y += point.y;
            });
            secondCenter.x /= element.length;
            secondCenter.y /= element.length;

            if (
              getDistace(
                firstCenter.x,
                secondCenter.x,
                firstCenter.y,
                secondCenter.y
              ) < distance
            ) {
              distance = getDistace(
                firstCenter.x,
                secondCenter.x,
                firstCenter.y,
                secondCenter.y
              );
              minElement = index2;
            }
          }
        });
        groups[index] = [...groups[index], ...groups[minElement]];
        groups[minElement].length = 0;
        count--;
      }
    });
    console.log(count);
  }

  console.log(groups);
  let newGroups: IPoint[][] = Array(0);

  for (const iterator of groups) {
    if (!!iterator.length) newGroups.push(iterator);
  }
  return newGroups;
}
