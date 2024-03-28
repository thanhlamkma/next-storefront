import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Images from "src/assets/images";
import ComponentTitleLayout from "src/components/home/ComponentTitleLayout";
import { ProductDetailResponse } from "src/models/Product";
import { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
  viewedProductData?: ProductDetailResponse[];
};

const YourRecentView = ({ viewedProductData }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRedirectProduct = useCallback((id: number) => {
    router.push(router.basePath + `/products/${id}`);
  }, []);
  return (
    <ComponentTitleLayout
      className="your-recent-view-wrapper mb-[48px]"
      leftTitle={t("home:yourRecentViews")}
    >
      <Swiper
        // install Swiper modules
        modules={[Scrollbar]}
        spaceBetween={20}
        breakpoints={{
          1: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 5,
          },
          992: {
            slidesPerView: 6,
          },
          1200: {
            slidesPerView: 8,
          },
        }}
        scrollbar={{ draggable: true }}
      >
        {viewedProductData?.map((product) => {
          return (
            <SwiperSlide
              className="recent-product-wrapper relative cursor-pointer"
              onClick={() => handleRedirectProduct(Number(product.productTmplId))}
            >
              <div className="recent-product-img-wrapper aspect-[137.5/144.55] w-full bg-[#f4f4f4] text-white flex justify-center">
                <Image
                  className="w-full h-full"
                  objectFit="contain"
                  width={137}
                  height={154}
                  src={
                    product.productImageOdoo &&
                    product.productImageOdoo.length > 0
                      ? "data:image/png;base64," +
                        product.productImageOdoo[0].image
                      : Images.product.noProductImg
                  }
                />
              </div>
              <div className="recent-product-mask flex items-center justify-center absolute w-full aspect-[137.5/144.55] top-0 left-0 bg-[#333] opacity-0 "></div>
              <div className="recent-product-name text-white hover:underline text-[13px]">
                {product.name}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ComponentTitleLayout>
  );
};

export default YourRecentView;
