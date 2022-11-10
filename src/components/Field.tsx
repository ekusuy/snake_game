import React from "react";

type Props = {
  fields: string[][];
};

const Field: React.FC<Props> = ({ fields }) => {
  return (
    <div className="field">
      {fields.map((row) => {
        return row.map((column) => {
          return <div className={`dots ${column}`}></div>;
        });
      })}
    </div>
  );
};

export default Field;
