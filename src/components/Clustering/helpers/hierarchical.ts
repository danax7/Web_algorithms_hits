export function hierarchical(x: number[], y: number[]) {
  const points: { x: number; y: number; klaster: number }[] = x.map(
    (element, index) => {
      return { x: element, y: y[index], klaster: index };
    }
  );
  points.forEach((element, index) => {
    points.forEach((element2, index2) => {});
  });
}
