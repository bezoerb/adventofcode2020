const chalk = require("chalk");
const { run } = require("../lib/utils");

// Action N means to move north by the given value.
// Action S means to move south by the given value.
// Action E means to move east by the given value.
// Action W means to move west by the given value.
// Action L means to turn left the given number of degrees.
// Action R means to turn right the given number of degrees.
// Action F means to move forward by the given value in the direction the ship is currently facing.

const turn = (state, dir, degrees) => {
  const { direction } = state;
  const directions = ["east", "south", "west", "north"];
  const index = directions.findIndex((val) => val === direction);
  const delta = degrees / 90;

  if (dir === "R") {
    return {
      ...state,
      direction: directions[(index + delta) % directions.length],
    };
  } else {
    return {
      ...state,
      direction:
        directions[(directions.length + index - delta) % directions.length],
    };
  }
};

const forward = (state, value) => {
  const { direction, north, east } = state;
  switch (direction) {
    case "east":
      return { ...state, east: east + value };
    case "west":
      return { ...state, east: east - value };
    case "north":
      return { ...state, north: north + value };
    case "south":
      return { ...state, north: north - value };
  }

  return state;
};

// Action N means to move the waypoint north by the given value.
// Action S means to move the waypoint south by the given value.
// Action E means to move the waypoint east by the given value.
// Action W means to move the waypoint west by the given value.
// Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
// Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
// Action F means to move forward to the waypoint a number of times equal to the given value.
const turn2 = (state, dir, degrees) => {
  const { wp } = state;

  const deg = dir === "R" ? degrees : 360 - degrees;

  switch (deg) {
    case 90:
      return { ...state, wp: { x: wp.y, y: wp.x * -1 } };
    case 180:
      return { ...state, wp: { x: wp.x * -1, y: wp.y * -1 } };
    case 270:
      return { ...state, wp: { x: wp.y * -1, y: wp.x } };
  }

  return state;
};

const forward2 = (state, value) => {
  const { ship, wp } = state;

  return {
    ...state,
    ship: {
      x: ship.x + wp.x * parseFloat(value),
      y: ship.y + wp.y * parseFloat(value),
    },
  };
};

run((input) => {
  const steps = input
    .trim()
    .split(/[\r\n]/)
    .map((val) => {
      const [, action, value] = /([NSEWLRF])(\d+)/.exec(val);
      return { action, value: parseFloat(value) };
    });

  const position = steps.reduce(
    (state, step) => {
      const { action, value } = step;

      switch (action) {
        case "N":
          return { ...state, north: state.north + value };
        case "S":
          return { ...state, north: state.north - value };
        case "E":
          return { ...state, east: state.east + value };
        case "W":
          return { ...state, east: state.east - value };
        case "L":
        case "R":
          return turn(state, action, value);
        case "F":
          return forward(state, value);
      }

      return state;
    },
    {
      direction: "east",
      east: 0,
      north: 0,
    }
  );

  console.log(position);
  console.log(
    chalk.cyan(
      `(1) What is the Manhattan distance between that location and the ship's starting position?`
    )
  );
  console.log(
    chalk.bold.green(Math.abs(position.east) + Math.abs(position.north))
  );

  // Part 2
  const position2 = steps.reduce(
    (state, step) => {
      const { wp } = state;
      const { x, y } = wp;
      const { action, value } = step;
      switch (action) {
        case "N":
          return { ...state, wp: { x, y: y + value } };
        case "S":
          return { ...state, wp: { x, y: y - value } };
        case "E":
          return { ...state, wp: { x: x + value, y } };
        case "W":
          return { ...state, wp: { x: x - value, y } };
        case "L":
        case "R":
          return turn2(state, action, value);
        case "F":
          return forward2(state, value);
      }

      return state;
    },
    {
      ship: { x: 0, y: 0 },
      wp: { x: 10, y: 1 },
    }
  );

  console.log(
    chalk.cyan(
      `(2) What is the Manhattan distance between that location and the ship's starting position?`
    )
  );

  console.log(
    chalk.bold.green(Math.abs(position2.ship.x) + Math.abs(position2.ship.y))
  );
});
