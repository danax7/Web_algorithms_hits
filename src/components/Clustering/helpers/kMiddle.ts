function getDistace(x1: number, x2: number, y1: number, y2: number) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
export const kMiddle = (
  klasters: { x: number[]; y: number[] },
  x: number[],
  y: number[]
): { x: number; y: number }[][] => {
  let groups: { x: number; y: number }[][] = Array(klasters.x.length).fill(
    Array(0)
  );
  let minElement = 0,
    oldDistance = 160000;
  while (true) {
    let newGroups: { x: number; y: number }[][] = Array(klasters.x.length).fill(
      Array(0)
    );
    x.forEach((element, index) => {
      (minElement = 0), (oldDistance = 160000);
      klasters.x.forEach((element2, index2) => {
        if (
          getDistace(element, element2, y[index], klasters.y[index2]) <
          oldDistance
        ) {
          minElement = index2;
          oldDistance = getDistace(
            element,
            element2,
            y[index],
            klasters.y[index2]
          );
        }
      });
      newGroups[minElement] = [
        ...newGroups[minElement],
        { x: element, y: y[index] },
      ];
    });
    console.log(klasters);
    if (JSON.stringify(groups) == JSON.stringify(newGroups)) break;
    groups = newGroups.slice(0);
    klasters.x = klasters.x.map((element, index) => {
      element = 0;
      newGroups[index].forEach((element2) => {
        element += element2.x;
      });
      return element / newGroups[index].length;
    });
    klasters.y = klasters.y.map((element, index) => {
      element = 0;
      newGroups[index].forEach((element2) => {
        element += element2.y;
      });
      return element / newGroups[index].length;
    });
  }
  return groups;
};
