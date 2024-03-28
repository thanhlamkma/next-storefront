import { Row, RowProps } from "antd";
import React from "react";

type Props = RowProps;

const RowContainer = ({ children, className, ...props }: Props) => {
  return (
    <Row
      className={`first-row-footer w-[100%] max-w-[1280px] mx-[auto!important] ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </Row>
  );
};

export default RowContainer;
