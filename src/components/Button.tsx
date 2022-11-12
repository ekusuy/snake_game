import React from "react";

type Props = {
  status: string;
  onStart: VoidFunction;
  onRestart: VoidFunction;
  onStop: VoidFunction;
};

const Button: React.FC<Props> = ({ status, onStart, onRestart, onStop }) => {
  return (
    <div className="button">
      {status === "gameover" && <button onClick={onRestart}>gameover</button>}
      {status === "init" && <button onClick={onStart}>start</button>}
      {status === "suspended" && <button onClick={onStart}>start</button>}
      {status === "playing" && <button onClick={onStop}>stop</button>}
    </div>
  );
};

export default Button;
