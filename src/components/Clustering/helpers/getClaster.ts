export function getClaster(count: number): { x: number[]; y: number[] } {
  let x: number[] = Array(3).fill(0);
  let y: number[] = Array(3).fill(0);

  x = x.map(() => Math.floor(Math.random() * 400));
  y = y.map(() => Math.floor(Math.random() * 400));

  return { x, y };
}
