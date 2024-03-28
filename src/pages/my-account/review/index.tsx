import { Col, Modal, Pagination, Rate, Row } from "antd";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import {
  GetImagesByProductTmpResponse,
  ListRatingProductsResponse,
  RatingProductResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import ProductRepository from "src/repositories/ProductRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";

interface ReviewProps {
  reviewsData: ListRatingProductsResponse | null;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: ReviewProps = {
      reviewsData: null,
    };

    try {
      if (session) {
        const { data: reviewsData } = await lastValueFrom(
          RatingProductRepository.getListByUser({
            pageIndex: Number.isInteger(Number(context.query.page))
              ? Number(context.query.page)
              : undefined,
            pageSize: Number.isInteger(Number(context.query.limit))
              ? Number(context.query.limit)
              : undefined,
          })
        );
        propsData.reviewsData = reviewsData;
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

type ReviewItemProps = {
  item: RatingProductResponse;
};

const dataImg = {
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
  selected: 0,
};
export const ReviewItem: React.FC<ReviewItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const [imagesCommentData, setImagesCommentData] = useState(dataImg);

  const ratingLevel = (rating: number) => {
    switch (rating) {
      case 5:
        return t("common:extremelySatisfied");
      case 4:
        return t("common:satisfied");
      case 3:
        return t("common:normal");
      case 2:
        return t("common:unsatisfied");
      case 1:
        return t("common:dissatisfaction");
    }
  };

  const handleCancel = () =>
    setImagesCommentData((prev) => {
      return {
        ...prev,
        previewVisible: false,
      };
    });

  const handlePreview = async (url: any, index: any) => {
    setImagesCommentData((prev) => {
      return {
        ...prev,
        previewImage: url,
        previewVisible: true,
        previewTitle: url.substring(url.lastIndexOf("/") + 1),
        selected: index,
      };
    });
  };

  return (
    <div className="mb-6 border p-4 rounded-[3px]">
      <div className="flex font-medium text-slate-500 text-sm border-b pb-4">
        <Rate
          className="mr-3"
          defaultValue={item.rating}
          style={{ fontSize: "1.15rem" }}
          disabled
        />
        {ratingLevel(item.rating)}
      </div>
      <Row
        gutter={{
          xs: 0,
          md: 10,
        }}
        className="cart-product py-[20px] border-b"
      >
        <Col
          xs={{
            span: 24,
          }}
          md={24}
          className="product-img-name flex md:flex-row s:flex-col"
        >
          <div className="cart-product-img-wrapper relative xs:max-w-[80%] md:max-w-[70px]">
            <div className="order-manager-img-wrapper overflow-hidden">
              <Image
                src={
                  item.productImage && item.productImage.length > 0
                    ? "data:image/png;base64," + item.productImage[0].image
                    : Images.product.noProductImg
                }
                width={150}
                height={130}
                objectFit="contain"
              />
            </div>
          </div>
          <div>
            <span className="cart-product-name flex-1 xs:mb-[5px] md:mx-0 pl-[20px] font-medium block">
              {item.productName}
            </span>
            <span className="order-manager-store-name pl-[20px] flex text-xs">
              {t("myAccount:distributors")}: Tii Trading
            </span>
          </div>
        </Col>
      </Row>
      <div className="flex justify-between p-4 text-justify">
        {item.description}
      </div>
      <div className="flex justify-between p-4 pt-0">
        {item.images && item.images.length > 0 && (
          <Row style={{ width: "100%" }}>
            {item.images.map((image, index) => (
              <Col key={index} span={2}>
                <div className="border m-1 cursor-pointer flex items-center justify-center">
                  <Image
                    onClick={() => handlePreview(image, index)}
                    src={image}
                    width={60}
                    height={60}
                    objectFit="cover"
                  />
                </div>
              </Col>
            ))}
            <Modal
              visible={imagesCommentData.previewVisible}
              footer={null}
              onCancel={handleCancel}
              className="modal-image"
            >
              <Carousel selectedItem={imagesCommentData.selected}>
                {item.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} />
                  </div>
                ))}
              </Carousel>
            </Modal>
          </Row>
        )}
      </div>
    </div>
  );
};

type FilterType = {
  limit: number;
  page: number;
};

const Review: PageComponent<ReviewProps> = ({ reviewsData }) => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<FilterType>({
    page: 1,
    limit: 6,
  });
  const [reviews, setReviews] = useState<ListRatingProductsResponse | null>(
    reviewsData
  );
  // Call API
  const { run: getReviewsApi } = useJob(() => {
    return RatingProductRepository.getListByUser({
      pageIndex: filter.page,
      pageSize: filter.limit,
    }).pipe(
      map(({ data }: { data: ListRatingProductsResponse }) => {
        setReviews(data);
      }),
      catchError((err) => {
        console.log("get review err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    getReviewsApi();
  }, [filter]);

  // Pagination
  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const renderPagination = useMemo(() => {
    return reviews && reviews.data.length ? (
      <Pagination
        current={filter.page}
        total={reviews.total}
        pageSize={Number(filter.limit)}
        onChange={handlePageChange}
      />
    ) : (
      <></>
    );
  }, [reviews, filter.page]);

  return (
    <div id="my-review" className="mb-5">
      <Head>
        <title>{t("myAccount:myReview")}</title>
      </Head>
      <div className="review-manager">
        {reviews && reviews.data.length > 0 ? (
          <div>
            {reviews.data.map((item) => (
              <ReviewItem key={`product-${item.id}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-5">
            <div className="mb-4 text-2xl">{t("myAccount:noCommentsYet")}</div>
          </div>
        )}
        <div className="flex justify-center mt-5">{renderPagination}</div>
      </div>
    </div>
  );
};

Review.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Review;
