import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Field from "./components/Field";
import Button from "./components/Button";
import ManipulationPanel from "./components/ManipulationPanel";
import { initFields } from "./utils/index";
import { Position } from "./common/Position";

const initialPosition: Position = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);
const defaultInterval = 100;

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

function App() {
  const [fields, setFields] = useState<string[][]>(initialValues);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [status, setStatus] = useState<string>(GameStatus.init);
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
    const canContinue = goUp();
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
  };

  const goUp = (): boolean => {
    const { x, y } = position;

    const newPosition = { x, y: y - 1 };
    if (isCollision(fields.length, newPosition)) {
      unsubscribe();
      return false;
    }
    // スネークの元いた位置を空に
    fields[y][x] = "";
    // 次にいる場所を"snake"に変更
    fields[newPosition.y][x] = "snake";
    // スネークの位置を更新
    setPosition(newPosition);
    // フィールドを更新
    setFields(fields);
    return true;
  };

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
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
