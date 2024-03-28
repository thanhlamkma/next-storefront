import { Divider } from "antd";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";

interface SectionProductProps {
  title?: string;
  children: any;
  expand?: ReactNode;
  positionTitle?: "left" | "center";
  onClickExpand?: () => void;
}

const SectionProduct = ({
  title,
  children,
  expand,
  onClickExpand,
  positionTitle = "left",
}: SectionProductProps) => {
  const { t } = useTranslation();

  return (
    <div id="section">
      <div className="flex items-center relative">
        <h4
          className={classNames([
            `text-xl text-black-33 font-semibold flex-grow mb-0 text-${positionTitle}`,
          ])}
        >
          {title}
        </h4>
        <div className="absolute right-0 top-[50%] translate-y-[-50%]">
          {expand ? (
            expand
          ) : (
            <div
              onClick={onClickExpand}
              className="flex items-center gap-2 cursor-pointer font-semibold text-black-33"
            >
              {t("common:more")} <BsArrowRight />
            </div>
          )}
        </div>
      </div>
      <Divider style={{ margin: "16px 0px" }} />
      <div>{children}</div>
    </div>
  );
};

export default SectionProduct;
