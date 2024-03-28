import { Col, Row } from "antd";
import classnames from "classnames";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Zoom from "react-img-zoom";
import Images from "src/assets/images";
import InfoCard from "src/components/products/productDetail/InfoCart";
import { useMount } from "src/core/hooks";
import { makeId } from "src/core/utilities";
import {
  ListAttributeProductResponse,
  ListCountStarRatingResponse,
  ProductDetailResponse,
} from "src/models/Product";
import { Navigation, Swiper as CsSwiper, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

interface SlideProduct {
  id: number | string;
  text?: string;
  image: string;
}

const dataSlideProducts: Array<SlideProduct> = [
  { id: 1, text: "watch front", image: Images.watch.watchFront },
  { id: 2, text: "watch above", image: Images.watch.watchAbove },
  { id: 3, text: "watch behind", image: Images.watch.watchBehind },
  { id: 4, text: "watch beside", image: Images.watch.watchBeside },
  { id: 5, text: "watch behind 2", image: Images.watch.watchBehind },
  { id: 6, text: "watch beside 2", image: Images.watch.watchBeside },
];

interface SlideCartProps {
  productDetail?: ProductDetailResponse | null;
  ratingProduct?: ListCountStarRatingResponse | null;
  attributeProduct?: ListAttributeProductResponse | null;
  imgProductData?: Array<SlideProduct>;
}

const SlideCart = (props: SlideCartProps) => {
  const { t } = useTranslation();

  const [thumbsSwiper, setThumbsSwiper] = useState<CsSwiper | undefined>(
    undefined
  );
  const refWrapImage = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState<{
    width: string | number;
    height: string | number;
  } | null>(null);

  const [imgData, setImgData] = useState<SlideProduct[]>(() => {
    const data: SlideProduct[] = [];
    if (props.productDetail && props.productDetail.productImageOdoo) {
      props.productDetail.productImageOdoo.map((item) => {
        data.push({
          id: makeId(5),
          image: "data:image/png;base64," + item.image,
        });
      });
    } else {
      data.push({ id: 1, image: Images.product.noProductImg });
    }
    return data;
  });
  const [slidePreview, setSlidePreview] = useState<SlideProduct>(imgData[0]);

  useEffect(() => {
    const data: SlideProduct[] = [];
    if (props.productDetail && props.productDetail.productImageOdoo) {
      props.productDetail.productImageOdoo.map((item) => {
        data.push({
          id: makeId(5),
          image: "data:image/png;base64," + item.image,
        });
      });
    } else {
      data.push({ id: 1, image: Images.product.noProductImg });
    }
    setImgData(data);
    setSlidePreview(data[0]);
  }, [props.productDetail]);

  const handleWidthAndHeight = useCallback(() => {
    if (refWrapImage && refWrapImage.current) {
      setSize({
        width: refWrapImage.current.offsetWidth,
        height: refWrapImage.current.offsetWidth,
      });
    }
  }, [refWrapImage.current?.offsetHeight, refWrapImage.current?.offsetWidth]);

  useMount(() => {
    handleWidthAndHeight();
  });

  useEffect(() => {
    window.addEventListener("resize", handleWidthAndHeight);
    return () => window.removeEventListener("resize", handleWidthAndHeight);
  }, []);

  const handleSwiperPreview = useCallback(
    ({ activeIndex }) => {
      const slidePreview: SlideProduct = imgData[activeIndex];
      setSlidePreview(slidePreview);
    },
    [setSlidePreview]
  );

  const ShowZoom = useCallback(
    ({ slide }) => {
      return size?.width && size.height ? (
        <Zoom
          img={slide.image}
          zoomScale={1.8}
          width={size.width}
          height={size.height}
          transitionTime={0.3}
        />
      ) : (
        <></>
      );
    },
    [size?.height, size?.width]
  );

  return (
    <div id="slide-cart">
      <Row gutter={20}>
        <Col
          xs={24}
          md={12}
          className="image-product-swipper w-full h-auto xs:mb-8 md:mb-[unset]"
        >
          <div className="w-full h-full">
            <div className="product-review w-full mb-4" ref={refWrapImage}>
              <Swiper
                navigation={true}
                modules={[Navigation, Thumbs]}
                onSlideChange={handleSwiperPreview}
                className="swiper-products"
                grabCursor={true}
                thumbs={{ swiper: thumbsSwiper }}
              >
                {imgData.map((slide, index) => (
                  <SwiperSlide
                    className="swiper-product"
                    key={`${slide.id}-${index}`}
                  >
                    {/* <Image
                      src={slide.image}
                      width={460}
                      height={460}
                      objectFit="contain"
                    /> */}
                    <div className="zoom-wrapper">
                      <ShowZoom slide={slide} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="list-image-swiper">
              <Swiper
                navigation={true}
                slidesPerView={4}
                spaceBetween={16}
                slidesPerGroup={4}
                modules={[Navigation, Thumbs]}
                className="swiper-list-products"
                grabCursor={true}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
              >
                {imgData.map((slide, index) => (
                  <SwiperSlide
                    className={classnames({
                      active: slide.id === slidePreview.id,
                    })}
                    key={`${slide.id}-${index}`}
                  >
                    <div className="preview-img-wrap">
                      <Image
                        src={slide.image}
                        width={110}
                        height={120}
                        objectFit="contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} className="info-product text-black-33">
          {/* view info cart buy */}
          {props.productDetail ? (
            <InfoCard
              productDetail={props.productDetail}
              ratingProduct={props.ratingProduct}
              attributeProduct={props.attributeProduct}
            />
          ) : (
            t("products:noInfor")
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SlideCart;
