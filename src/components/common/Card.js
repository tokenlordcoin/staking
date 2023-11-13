import React from "react";

const Card = ({ title, className, noLine, children }) => {
  return (
    <div
      className={
        "w-full rounded-lg card-bg pb-4" + (className ? className : "")
      }
    >
      <div className={`text-center font-Montserrat-ExtraBold text-white text-2xl uppercase pt-3 pb-2 ${noLine ? "" : "border-b border-solid border-white"}`}>
        {title}
      </div>
      {children}
    </div>
  );
};

export default Card;