import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import Images from "src/assets/images";
import ComponentTitleLayout from "src/components/home/ComponentTitleLayout";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {};

const colClient = Array.from({ length: 6 }, (_, i) => i + 1);
const cluster2 = Array.from({ length: 6 }, (_, i) => i + 6);

type BrandLogoType =
  | "BrandLogo1"
  | "BrandLogo2"
  | "BrandLogo3"
  | "BrandLogo4"
  | "BrandLogo5"
  | "BrandLogo6"
  | "BrandLogo7"
  | "BrandLogo8"
  | "BrandLogo9"
  | "BrandLogo10"
  | "BrandLogo11"
  | "BrandLogo12";

const OurClients = (props: Props) => {
  const { t } = useTranslation();
  return (
    <ComponentTitleLayout leftTitle={t("home:ourClients")}>
      <Swiper
        breakpoints={{
          1: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 6 },
        }}
      >
        {colClient.map((col) => {
          const client1Text = `BrandLogo${col * 2 - 1}`;
          const client2Text = `BrandLogo${col * 2}`;

          return (
            <SwiperSlide
              className="client-swipe-slide"
              key={`client-col-${col}`}
            >
              <div className="client-col">
                <div className="client">
                  <div className="logo-brand-img-wrapper w-full flex">
                    <Image
                      className="w-full h-full"
                      objectFit="contain"
                      width={410}
                      height={186}
                      src={Images.logo.brandLogo[client1Text as BrandLogoType]}
                    />
                  </div>
                </div>
                <div className="client">
                  <div className="logo-brand-img-wrapper w-full flex">
                    <Image
                      className="w-full h-full"
                      objectFit="contain"
                      width={410}
                      height={186}
                      src={Images.logo.brandLogo[client2Text as BrandLogoType]}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ComponentTitleLayout>
  );
};

export default OurClients;
