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

const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
};

function App() {
  const [fields, setFields] = useState<string[][]>(initialValues);
  const [position, setPosition] = useState<Position>(initialPosition);
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
    if (!position) {
      return;
    }
    goUp();
  }, [tick]);

  const goUp = () => {
    const { x, y } = position;

    // フィールドの新しい座標を取得
    const nextY = Math.max(y - 1, 0);
    // スネークの元いた位置を空に
    fields[y][x] = "";
    // 次にいる場所を"snake"に変更
    fields[nextY][x] = "snake";
    // スネークの位置を更新
    setPosition({ x, y: nextY });
    // フィールドを更新
    setFields(fields);
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
        <Button />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
