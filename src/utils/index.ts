
import { Position } from '../common/Position';

export const initFields = (fieldSize: number, initialPosition: Position) => {
  const fields = [];
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill("");
    fields.push(cols);
  }
  fields[initialPosition.x][initialPosition.y] = "snake";

  return fields;
};
