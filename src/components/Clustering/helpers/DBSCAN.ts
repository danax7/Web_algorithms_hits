import { IPoint } from "../types/Point";

function getDistace(x1: number, x2: number, y1: number, y2: number) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function DBSCAN(
  points: IPoint[],
  radius: number,
  minNumber: number
): IPoint[][] {
  let groups: IPoint[] = points.map((element, index) => {
    return { x: element.x, y: element.y, claster: index };
  });
  let indexes: number[] = [];
  points.forEach((element, index) => {
    points.forEach((element2, index2) => {
      if (getDistace(element.x, element2.x, element.y, element2.y) <= radius) {
        indexes.push(index2);
      }
    });
    if (indexes.length >= minNumber) {
      indexes.forEach((element2) => {
        groups[element2].claster = index;
      });
    }
    indexes.length = 0;
  });
  console.log(groups);
  let newGroups: IPoint[][] = Array(0);
  for (let i = 0, lastIndex = 0; i < groups.length; i++) {
    newGroups[lastIndex] = [];
    for (let j = 0; j < groups.length; j++) {
      if (groups[j].claster == i)
        newGroups[lastIndex].push({
          x: groups[j].x,
          y: groups[j].y,
        });
    }
    if (newGroups[lastIndex].length <= 1) newGroups[lastIndex].length = 0;
    else lastIndex++;
  }
  if (!newGroups[newGroups.length - 1].length) newGroups.length--;
  return newGroups;
}
