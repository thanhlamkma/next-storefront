import { Col, Form as AntForm, Progress, Row } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Rating } from "src/components";
import FeedbackList from "src/components/products/productDetail/productDetailContent/FeedbackList";
import { ListCountStarRatingResponse } from "src/models/Product";

// const starReviews = [
//   { star: 5, progress: 70 },
//   { star: 4, progress: 30 },
//   { star: 3, progress: 40 },
//   { star: 2, progress: 0 },
//   { star: 1, progress: 0 },
// ];

interface CustomerReviewsProps {
  ratingProduct?: ListCountStarRatingResponse | null;
}

const CustomerReviews = ({ ratingProduct }: CustomerReviewsProps) => {
  const { t } = useTranslation();
  const [form] = AntForm.useForm();

  const onFinishForm = useCallback(() => {
    form.resetFields();
  }, []);

  return (
    <div id="custom-reivews">
      {ratingProduct && ratingProduct[0] ? (
        <Row gutter={[32, 20]}>
          <Col xs={24} lg={8}>
            <>
              <div className="flex items-center gap-4">
                <div className="text-blue-33 xl:text-[60px] text-[45px] font-bold">
                  {ratingProduct[0].average.toFixed(1)}
                </div>
                <div>
                  <div>{t("products:averageRating")}</div>
                  <Rating
                    allowHalf
                    defaultValue={Number(ratingProduct[0].average.toFixed(2))}
                    disabled
                    count={5}
                    reviews={ratingProduct[0].total}
                  />
                </div>
              </div>
              {/* <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl text-black-33 font-semibold">
                  66.7%
                </div>
                <div className="text-sm text-black-33">
                  {t("common:recommended")}{" "}
                  <span className="text-xs text-gray-aa">(2 of 3)</span>
                </div>
              </div> */}
              <div className="flex items-center mb-2">
                <Rating defaultValue={5} disabled count={5} width="auto" />
                <Progress
                  size="small"
                  percent={ratingProduct[0].five}
                  format={(percent) => `${percent}`}
                />
              </div>
              <div className="flex items-center mb-2">
                <Rating defaultValue={4} disabled count={5} width="auto" />
                <Progress
                  size="small"
                  percent={ratingProduct[0].four}
                  format={(percent) => `${percent}`}
                />
              </div>
              <div className="flex items-center mb-2">
                <Rating defaultValue={3} disabled count={5} width="auto" />
                <Progress
                  size="small"
                  percent={ratingProduct[0].three}
                  format={(percent) => `${percent}`}
                />
              </div>
              <div className="flex items-center mb-2">
                <Rating defaultValue={2} disabled count={5} width="auto" />
                <Progress
                  size="small"
                  percent={ratingProduct[0].two}
                  format={(percent) => `${percent}`}
                />
              </div>
              <div className="flex items-center mb-2">
                <Rating defaultValue={1} disabled count={5} width="auto" />
                <Progress
                  size="small"
                  percent={ratingProduct[0].one}
                  format={(percent) => `${percent}`}
                />
              </div>
            </>
            {/* {starReviews?.map((item) => (
            <div className="flex items-center mb-2">
              <Rating
                defaultValue={item.star}
                disabled
                count={5}
                width="auto"
              />
              <Progress size="small" percent={item.progress} />
            </div>
          ))} */}
          </Col>
          <Col xs={24} lg={16}>
            <FeedbackList
              productId={
                ratingProduct && ratingProduct[0]
                  ? ratingProduct[0].productId
                  : undefined
              }
            />
            {/* <Form
            enableReinitialize
            form={form}
            onFinish={onFinishForm}
            initialValues={{}}
            >
            <h4 className="text-xl font-semibold capitalize">
            {t("products:submitReview")}
            </h4>
            <p className="text-gray-66">{t("products:noteReviewForm")}</p>
            <div className="flex mb-6">
            <span className="text-gray-66 mr-2">
            {t("products:ratingForm")} :
            </span>
            <Form.Item name="rating">
            <Rating className="inline-block" count={5} width="auto" />
            </Form.Item>
            </div>
            <div>
            <Form.Item name="description">
            <Input.TextArea
            rows={4}
            placeholder="Write Your Review Here..."
            ></Input.TextArea>
            </Form.Item>
            </div>
            <Row gutter={16}>
            <Col xs={24} md={12}>
            <Form.Item>
            <Input placeholder="Your Name" />
            </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item>
              <Input placeholder="Your Email" />
              </Form.Item>
              </Col>
              </Row>
              <div>
              <Form.Item name="remember" valuePropName="checked">
              <Checkbox className="text-gray-66">
              {t("products:recommand")}
              </Checkbox>
              </Form.Item>
              </div>
              <Button
              className="uppercase button-submit-review cursor-pointer"
              htmlType="submit"
              >
              {t("products:submitReviewBtn")}
              </Button>
            </Form> */}
          </Col>
        </Row>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <p className="mt-5 text-base text-gray-400">
            {t("products:noRating")}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
