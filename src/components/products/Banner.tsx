import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineArrowRight } from "react-icons/ai";
import Images from "src/assets/images";
import { Button } from "src/components";

interface BannerProps {}

const Banner = (props: BannerProps) => {
  const { t } = useTranslation();
  return (
    <div
      id="banner"
      className="sm:mb-6 mb-3 h-80 flex items-center py-[74px] px-[86px]"
    >
      <div className="relative z-10">
        {/* <h4 className="font-semibold text-black-33 text-[28px] mb-0">
          Accessories Collection
        </h4>
        <h3 className="text-[40px] text-white font-bold">
          Smart Wrist Watches
        </h3>
        <Button className="btn-discovery">
          <div className="flex items-center justify-center gap-1 text-white text-sm font-semibold uppercase">
            {t("products:discoveryNow")}{" "}
            <AiOutlineArrowRight className="text-lg" />
          </div>
        </Button> */}
      </div>
    </div>
  );
};

export default Banner;
