import React from "react";

type Props = {} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Container = ({ children, className, ...props }: Props) => {
  return (
    <div className={`container ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
