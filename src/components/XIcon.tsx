import React from "react";
import { IconBaseProps } from "react-icons";
import { RiCloseFill } from "react-icons/ri";

type Props = {
  iconProps?: IconBaseProps;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const XIcon = ({ iconProps, className, ...props }: Props) => {
  return (
    <div className={`x-icon  ${className || ""}`} {...props}>
      <RiCloseFill {...iconProps} fontSize={18} />
    </div>
  );
};

export default XIcon;
