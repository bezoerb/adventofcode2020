const chalk = require("chalk");
const { run } = require("../lib/utils");
const { sum } = require("../lib/array");

const FLOOR = ".";
const FREE = "L";
const OCCUPIED = "#";

const countOccupiedAdjacent = (seats, col, row) => {
  let cnt = 0;
  for (y = row - 1; y <= row + 1; y++) {
    for (x = col - 1; x <= col + 1; x++) {
      if (!(x === col && y === row) && (seats[y] || [])[x] === OCCUPIED) {
        cnt++;
      }
    }
  }

  return cnt;
};

const findSeat = (seats, pos, delta) => {
  const newPos = {
    x: pos.x + delta.x,
    y: pos.y + delta.y,
  };
  const value = (seats[newPos.y] || [])[newPos.x];
  if (value === FLOOR) {
    return findSeat(seats, newPos, delta);
  }

  return value;
};

const countVisibleOccupied = (seats, col, row) => {
  let cnt = 0;
  for (y = -1; y <= 1; y++) {
    for (x = -1; x <= 1; x++) {
      if (x === 0 && y === 0) {
        continue;
      }

      const seatvalue = findSeat(seats, { x: col, y: row }, { x, y });
      if (seatvalue === OCCUPIED) {
        cnt++;
      }
    }
  }

  return cnt;
};

const applyRules = (seats, { method, max }) => {
  let changed = 0;
  const newSeats = [...seats].map((row, y) =>
    row.map((seat, x) => {
      const occupiedAdjacent = method(seats, x, y);
      if (seat === FREE && occupiedAdjacent === 0) {
        changed++;
        return OCCUPIED;
      } else if (seat === OCCUPIED && occupiedAdjacent >= max) {
        changed++;
        return FREE;
      }

      return seat;
    })
  );

  return { seats: newSeats, changed };
};

run((input) => {
  const seats = input
    .trim()
    .split(/[\r\n]/)
    .map((val) => val.split(""));

  let data = [...seats];
  let round = 0;
  let moved = 0;

  /*
  do {
    let { seats, changed } = applyRules([...data], {
      method: countOccupiedAdjacent,
      max: 4,
    });
    moved = changed;
    data = seats;
    round++;
  } while (moved > 0);

  console.log("Rounds:", round);

  console.log(
    "Occupied:",
    chalk.green.bold(data.flat().filter((s) => s === OCCUPIED).length)
  );
  console.log(
    "Free:",
    chalk.green.bold(data.flat().filter((s) => s === FREE).length)
  );
  */

  do {
    let { seats, changed } = applyRules([...data], {
      method: countVisibleOccupied,
      max: 5,
    });
    moved = changed;
    data = seats;
    round++;
  } while (moved > 0);

  console.log("Rounds:", round);

  console.log(
    "Occupied:",
    chalk.green.bold(data.flat().filter((s) => s === OCCUPIED).length)
  );
  console.log(
    "Free:",
    chalk.green.bold(data.flat().filter((s) => s === FREE).length)
  );
});
