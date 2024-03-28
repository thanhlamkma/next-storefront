import {
  CheckCircleTwoTone,
  LikeFilled,
  LikeOutlined,
  SendOutlined,
  SmileOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form as AntForm,
  Modal,
  Pagination,
  Rate,
  Row,
  Spin,
} from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { catchError, map, of } from "rxjs";
import { Form, Input } from "src/components";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import LoginModal from "src/components/modal/LoginForm";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import {
  CommentRatingResponse,
  ListRatingProductsResponse,
  RatingProductResponse,
} from "src/models/Product";
import RatingProductRepository from "src/repositories/RatingProductRepository";
import toast from "src/services/toast";

interface FeedbackListProp {
  productId?: number;
}

type FeedbackProps = {
  item: RatingProductResponse;
  onReload: () => void;
  setModalAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

type FilterValue = {
  limit: number;
  page: number;
};

const dataImg = {
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
  selected: 0,
};

export const FeedbackItem: React.FC<FeedbackProps> = ({
  item,
  onReload,
  setModalAuth,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const [form] = AntForm.useForm();

  const [imagesCommentData, setImagesCommentData] = useState(dataImg);
  const [like, setLike] = useState<boolean>(false);
  const [likeNumber, setLikeNumber] = useState<number>(item.like);
  const [posibleCmt, setPosibleCmt] = useState<boolean>(false);
  const [watchMore, setWatchMore] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentRatingResponse[]>(
    item.comment
  );

  useEffect(() => {
    const check = item.userIds?.map((id) => id === session.data?.user.id);
    if (check.includes(true)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, []);

  // Call API
  const { run: addLikeRatingApi } = useJob(() => {
    return RatingProductRepository.addLikeRating({ key: item.key }).pipe(
      map(() => {
        setLikeNumber(like ? likeNumber - 1 : likeNumber + 1);
        setLike(!like);
      }),
      catchError((err) => {
        return of(err);
      })
    );
  });

  const { run: addCommentRatingApi } = useJob((description: string) => {
    return RatingProductRepository.addCommentRating({
      key: item.key,
      description: description,
    }).pipe(
      map(() => {
        toast.show("success", t("products:cmtSuccess"));
      }),
      catchError((err) => {
        console.log("cmt err", err);
        return of(err);
      })
    );
  });

  // Handle like rating of product
  const handleLikeRating = () => {
    if (session.status === "authenticated") {
      addLikeRatingApi();
    } else {
      router.push({
        pathname: "/auth/login",
      });
      // setModalAuth(true);
    }
  };

  // Handle open input to comment rating
  const toggleCmt = () => {
    if (session.status === "authenticated") {
      setPosibleCmt(!posibleCmt);
    } else {
      router.push({
        pathname: "/auth/login",
      });
      // setModalAuth(true);
    }
  };

  // Handle comment rating of product
  const handleCommentRating = ({ comment }: { comment: any }) => {
    addCommentRatingApi(comment);
    const commentsData: CommentRatingResponse[] = comments;
    commentsData.push({
      userName: session.data?.user.name,
      description: comment,
      createDate: new Date().toDateString(),
    });
    setComments(commentsData);
    setReload(!reload);
    onReload();
    form.resetFields();
  };

  // Handle cancle preview picture
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

  // Get date of comment rating
  const getCreateDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " - " + mm + " - " + yyyy;
  };

  // Get rating level
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

  // Handle when click watch more
  const handleWatchMore = () => {
    setWatchMore(!watchMore);
  };

  // Render comment rating
  const renderComment = useMemo(() => {
    return watchMore ? (
      <>
        {comments
          .map((cmt) => (
            <div className="px-4 pt-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-semibold">{cmt.userName}</span>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-400">
                  {getCreateDate(cmt.createDate)}
                </span>
              </div>
              <p>{cmt.description}</p>
            </div>
          ))
          .reverse()}
        {comments.length > 1 ? (
          <div
            className="flex items-center gap-2 text-[#0b74e5] cursor-pointer"
            onClick={handleWatchMore}
          >
            <SwapLeftOutlined className="text-base" />
            {t("products:collapseCmt")}
          </div>
        ) : (
          ""
        )}
      </>
    ) : (
      <>
        {comments.map((cmt, index) => {
          if (comments && index === comments.length - 1) {
            return (
              <>
                <div className="px-4 pt-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{cmt.userName}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="text-xs text-gray-400">
                      {getCreateDate(cmt.createDate)}
                    </span>
                  </div>
                  <p>{cmt.description}</p>
                </div>
                {comments.length > 1 ? (
                  <div
                    className="flex items-center gap-2 text-[#0b74e5] cursor-pointer"
                    onClick={handleWatchMore}
                  >
                    <SwapRightOutlined className="text-base" />
                    {t("products:watchMore")}
                    &nbsp;{comments.length - 1}&nbsp;
                    {t("products:moreComments")}
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          }
        })}
      </>
    );
  }, [watchMore, comments, reload]);

  return (
    <div className="mb-6 border p-4 rounded-[3px]">
      <div className="flex-col font-medium text-slate-500 text-sm border-b pb-4">
        <div className="flex items-center gap-4 mb-2">
          {item.userName}
          <div className="flex items-center gap-1 text-xs text-[#00ab56]">
            <CheckCircleTwoTone
              style={{ fontSize: "14px" }}
              twoToneColor="#00ab56"
            />
            {t("myAccount:purchased")}
          </div>
        </div>
        <div className="flex gap-4">
          <Rate
            defaultValue={item.rating}
            style={{ fontSize: "1.15rem" }}
            disabled
          />
          {ratingLevel(item.rating)}
        </div>
      </div>
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
      {/* Thích đánh giá */}
      <div className="flex gap-4">
        {like ? (
          <div
            className="px-5 py-2 flex items-center gap-2 bg-[#dbeeff] border rounded border-[#dbeeff] font-medium text-[#0b74e5] cursor-pointer"
            onClick={handleLikeRating}
          >
            <LikeFilled />
            <span>
              {t("products:likeCmt")}&nbsp;
              {likeNumber === 0 ? "" : `(${likeNumber})`}
            </span>
          </div>
        ) : (
          <div
            className="px-5 py-2 flex items-center gap-2 border rounded border-[#0b74e5] font-medium text-[#0b74e5] cursor-pointer"
            onClick={handleLikeRating}
          >
            <LikeOutlined />
            <span>
              {t("products:likeCmt")}&nbsp;
              {item.like === 0 ? "" : `(${likeNumber})`}
            </span>
          </div>
        )}
        <div
          className="px-4 py-2 font-medium text-[#0b74e5] cursor-pointer"
          onClick={toggleCmt}
        >
          {t("products:comment")}
        </div>
      </div>
      {/* Bình luận đánh giá */}
      <Form
        className={
          posibleCmt
            ? "mt-4 py-1 px-4 flex items-center gap-4 rounded-2xl border hover:border-[#0d5cb6] focus-within:border-[#0d5cb6]"
            : "hidden"
        }
        form={form}
        onFinish={handleCommentRating}
        enableReinitialize
        initialValues={{}}
      >
        <Form.Item
          className="w-full"
          name="comment"
          rules={[
            {
              required: true,
              pattern: /(.*)(\S)(.*)/,
              message: t("products:cmtRequired"),
            },
          ]}
        >
          <Input placeholder="Viết câu trả lời" />
        </Form.Item>
        <Form.Item>
          <Button className="p-0 flex items-center" htmlType="submit">
            <SendOutlined className="text-xl opacity-40 cursor-pointer" />
          </Button>
        </Form.Item>
      </Form>
      {/* Xem bình luận */}
      {comments.length > 0 ? (
        <>
          <Divider />
          <div className="flex flex-col gap-4 ">{renderComment}</div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

const Review = ({ productId }: FeedbackListProp) => {
  const { t } = useTranslation();
  const [feedbackData, setFeedbackData] = useState<
    ListRatingProductsResponse | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterValue>({
    limit: 3,
    page: 1,
  });

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const { run: getFeedbackApi } = useJob(
    useCallback(() => {
      return RatingProductRepository.getListByProduct(Number(productId), {
        pageSize: filter.limit,
        pageIndex: filter.page,
      }).pipe(
        map(({ data }: { data: ListRatingProductsResponse }) => {
          setFeedbackData(data);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }),
        catchError((err) => {
          return of(err);
        })
      );
    }, [filter])
  );

  useEffect(() => {
    getFeedbackApi();
  }, [filter, productId]);

  const onPageChange = useCallback((page: number) => {
    handlePageChange(page);
  }, []);

  const handleReloading = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderPagination = useMemo(() => {
    return feedbackData && feedbackData.data.length > 0 ? (
      <Pagination
        current={filter.page}
        total={feedbackData.total}
        pageSize={filter.limit}
        onChange={onPageChange}
      />
    ) : (
      <></>
    );
  }, [feedbackData, filter]);

  return (
    <div id="my-review" className="mb-5">
      <div className="review-manager">
        <Spin spinning={loading}>
          {feedbackData && feedbackData?.data.length > 0 ? (
            <div>
              {feedbackData?.data.map((item) => (
                <FeedbackItem
                  key={`product-${item.id}`}
                  item={item}
                  setModalAuth={setModalAuth}
                  onReload={handleReloading}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5 justify-center items-center py-5">
              <SmileOutlined className="text-[50px] opacity-25" />
              <p className="mb-4 text-sm text-gray-400">
                {t("products:noRating")}
              </p>
            </div>
          )}
        </Spin>
        <div className="flex justify-center mt-5">{renderPagination}</div>
        <LoginModal
          className="customer-infor-modal"
          onCancel={() => setModalAuth(false)}
          centered
          visible={modalAuth}
          footer={null}
          closeIcon={
            <XIcon
              style={{
                top: "50%",
                right: "50%",
                transform: "translate(25%, -50%)",
              }}
            />
          }
        />
      </div>
    </div>
  );
};

Review.getLayout = (page: any) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Review;
