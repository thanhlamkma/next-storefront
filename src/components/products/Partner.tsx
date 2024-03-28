import Image from "next/image";
import { useTranslation } from "react-i18next";
import Images from "src/assets/images";
import { GetListVendorResponse } from "src/models/Partner";
import { Swiper, SwiperSlide } from "swiper/react";

const dataPartner: Array<{ name: string; image: string }> = [
  {
    name: "drnutri",
    image: Images.partner.drnutri,
  },
  {
    name: "purecle",
    image: Images.partner.purecle,
  },
  {
    name: "lotte",
    image: Images.partner.lotte,
  },
  {
    name: "samsung",
    image: Images.partner.samsung,
  },
  {
    name: "jenkit",
    image: Images.partner.jenkit,
  },
  {
    name: "kuchen",
    image: Images.partner.kuchen,
  },
  {
    name: "lacsell",
    image: Images.partner.lacsell,
  },
];

interface PartnerProps {
  vendorData: GetListVendorResponse | null;
}

const Partner = ({ vendorData }: PartnerProps) => {
  const { t } = useTranslation();

  return (
    <div id="partner" className="mb-8 mt-6">
      <div className="title-common">
        <span>{t("products:suppliers")}</span>
      </div>
      <Swiper
        spaceBetween={4}
        slidesPerView={7}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        pagination={{ clickable: true }}
      >
        {vendorData &&
          vendorData.data.map((partner) => (
            <SwiperSlide
              key={partner.name}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Image
                className="sm:w-[80px] lg:w-[130px] w-[40px] sm:h-[38px] lg:h-[69px] h-[18px]"
                src={partner.image ? partner.image : Images.commingSoon}
                height={100}
                width={150}
                objectFit="contain"
              />
              {partner.name}
            </SwiperSlide>
          ))}
        {/* {dataPartner.map((partner) => (
          <SwiperSlide
            key={partner.name}
            className="flex items-center justify-center gap-2"
          >
            <img
              className="sm:w-[80px] lg:w-[130px] w-[40px] sm:h-[38px] lg:h-[69px] h-[18px]"
              src={partner.image}
            />
          </SwiperSlide>
        ))} */}
      </Swiper>
    </div>
  );
};

export default Partner;
