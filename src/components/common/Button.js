import React from "react";
import cx from "classnames";

const Button = ({
  color = "white",
  bgColorHover = "red-800",
  bgColor = "primary",
  showBorder = false,
  onClick,
  className,
  children,
  uppercase = true,
}) => {

  return (
    <button
      onClick={onClick}
      className={cx(
        className,
        "rounded-md px-4 py-2 mx-1 font-Montserrat-ExtraBold",
        uppercase ? "uppercase" : "",
        showBorder ? "border" : "",
        "bg-" + bgColor,
        "hover:bg-" + bgColorHover,
        "hover:border-" + bgColorHover,
        "text-" + color,
        "hover:text-" + color,
        "border-" + color,
        "hover:border-" + color
      )}
    >
      {children}
    </button>
  );
};

export default Button;