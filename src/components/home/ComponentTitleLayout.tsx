import React from "react";
import Container from "src/components/Container";

type Props = {
  leftTitle?: string;
  rightTitle?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const ComponentTitleLayout = ({
  children,
  leftTitle,
  rightTitle,
  className,
  ...props
}: Props) => {
  return (
    <div className={`mt-[48px] ${className || ""}`} {...props}>
      <Container>
        <div className="title flex items-center justify-between border-bottom-gray-common py-[12px] my-[16px]">
          {leftTitle && (
            <h1 className="md:text-[20px] text-[18px] font-bold  .border-gray-common">
              {leftTitle}
            </h1>
          )}
          {rightTitle && (
            <span className="text-[14.8px] font-medium cursor-pointer hover:text-hover-color">
              {rightTitle}
            </span>
          )}
        </div>
        {children}
      </Container>
    </div>
  );
};

export default ComponentTitleLayout;
