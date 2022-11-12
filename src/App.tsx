import React, { useCallback, useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Field from "./components/Field";
import Button from "./components/Button";
import ManipulationPanel from "./components/ManipulationPanel";
import { initFields } from "./utils/index";
import { Position } from "./common/Position";

const initialPosition: Position = { x: 17, y: 17 };
const initialValues: string[][] = initFields(35, initialPosition);
const defaultInterval: number = 100;

let timer: number | NodeJS.Timer | undefined = undefined;

const unsubscribe = (): void => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
};

const isCollision = (fieldSize: number, position: Position): boolean => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }

  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    return true;
  }

  return false;
};

const GameStatus = Object.freeze({
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gameover: "gameover",
});

const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

interface receiveDirection {
  [key: string]: string;
}

const OppositeDirection: receiveDirection = Object.freeze({
  up: "down",
  right: "left",
  left: "right",
  down: "up",
});

interface receiveDelta {
  [key: string]: Position;
}

const Delta: receiveDelta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
});

interface KeyCode {
  [key: number]: string;
}

const DirectionKeyCodeMap: KeyCode = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});

function App() {
  const [fields, setFields] = useState<string[][]>(initialValues);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [status, setStatus] = useState<string>(GameStatus.init);
  const [direction, setDirection] = useState<string>(Direction.up);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    setPosition(initialPosition);
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!position || status !== GameStatus.playing) {
      return;
    }
    const canContinue = handleMoving();
    if (!canContinue) {
      setStatus(GameStatus.gameover);
    }
  }, [tick]);

  const onStart = (): void => setStatus(GameStatus.playing);

  const onRestart = (): void => {
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setStatus(GameStatus.init);
    setPosition(initialPosition);
    setFields(initFields(35, initialPosition));
    setDirection(Direction.up);
  };

  const onChangeDirection = useCallback(
    (newDirection: string) => {
      if (status !== GameStatus.playing) {
        return direction;
      }
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      setDirection(newDirection);
    },
    [direction, status]
  );

  const handleMoving = () => {
    const { x, y } = position;
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    if (isCollision(fields.length, newPosition)) {
      return false;
    }
    fields[y][x] = "";
    fields[newPosition.y][newPosition.x] = "snake";
    setPosition(newPosition);
    setFields(fields);
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }

      onChangeDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChangeDirection]);

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation />
      </header>
      <main className="main">
        <Field fields={fields} />
      </main>
      <footer className="footer">
        <Button status={status} onRestart={onRestart} onStart={onStart} />
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
