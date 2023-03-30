import { IPoint } from "../types/Point";

export function getClaster(count: number): IPoint[] {
  let klasters: IPoint[] = Array(count).fill({ x: 0, y: 0 });
  klasters = klasters.map(() => {
    return {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400),
    };
  });
  return klasters;
}
