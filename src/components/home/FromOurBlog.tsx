import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";
import Images from "src/assets/images";
import ComponentTitleLayout from "src/components/home/ComponentTitleLayout";
import { blogData } from "src/components/home/homedata";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {};

const FromOurBlog = (props: Props) => {
  const { t } = useTranslation();

  return (
    <ComponentTitleLayout
      className="from-our-blog"
      leftTitle={t("home:fromOurBlog")}
      rightTitle={t("common:viewAllArticles")}
    >
      <Swiper
        spaceBetween={20}
        breakpoints={{
          300: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        scrollbar={{ draggable: true }}
      >
        {blogData.map((blog) => {
          return (
            <SwiperSlide className="blog-wrapper">
              <div className="blog-img-wrapper w-[100%] aspect-[295/190] rounded-[4px] text-white flex">
                <Image
                  className="blog-img"
                  objectFit="cover"
                  src={blog.img || Images.errors.errorImage}
                  width={590}
                  height={380}
                />
              </div>
              <div className="blog-description my-[14px]">
                <p className="author-and-time flex items-center justify-center">
                  <span className="font-medium  text-[13px] text-[#999999]">
                    {t("common:by")}&nbsp;
                  </span>
                  <span className="font-semibold text-[14.8px]">
                    {blog.author}&nbsp;
                  </span>
                  - <span>&nbsp;{blog.time}</span>
                </p>
                <h1 className="blog-name text-center font-semibold text-[14.8px]">
                  {blog.name}
                </h1>
              </div>
              <p className="flex items-center justify-center cursor-pointer hover:text-hover-color">
                <span>{t("common:readMore")}&nbsp;</span>
                <span>
                  <BsArrowRight fontSize={16} />
                </span>
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ComponentTitleLayout>
  );
};

export default FromOurBlog;
