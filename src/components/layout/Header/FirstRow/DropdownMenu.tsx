import React from "react";

type Props = {
  top?: string | number;
  left?: string | number;
  show?: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const DropdownMenu = ({
  children,
  className,
  top,
  left,
  style,
  ...props
}: Props) => {
  return (
    <div
      className={`custom-dropdown-menu absolute z-[1000] flex flex-col px-[0.6rem] py-[0.5rem] ${
        className || ""
      }`}
      style={{
        top,
        left,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default DropdownMenu;
