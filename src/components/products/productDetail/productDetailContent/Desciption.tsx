import { useTranslation } from "react-i18next";
import { ProductDetailResponse } from "src/models/Product";

const checklist = [
  "Nunc nec porttitor turpis. In eu risus enim. In vitae mollis elit.",
  "Vivamus finibus vel mauris ut vehicula.",
  "Nullam a magna porttitor, dictum risus nec, faucibus sapien.",
];

const listFunc = [
  {
    title: "Free Shipping & Return",
    text: "We offer free shipping for products on orders above 50$ and offer free delivery for all orders in US.",
  },
  {
    title: "Free and Easy Returns",
    text: "We guarantee our products and you could get back all of your money anytime you want in 30 days.",
  },
  {
    title: "Special Financing",
    text: "Get 20%-50% off items over 50$ for a month or over 250$ for a year with our special credit card.",
  },
];

interface DescriptionProps {
  productDetail?: ProductDetailResponse | null;
}

const Description = (props: DescriptionProps) => {
  const { t } = useTranslation();

  return (
    <div id="description">
      <div className="flex flex-col gap-5 justify-center items-center pt-5 pb-2">
        {/* <SmileOutlined className="text-[50px] opacity-25" /> */}
        {props.productDetail?.description ? (
          <p>{props.productDetail?.description}</p>
        ) : (
          <p className="mb-2 text-base text-gray-400">
            {t("products:noDescription")}
          </p>
        )}
      </div>
      {/* <Row gutter={16} className="mb-5">
        <Col xs={24} sm={12}>
          <h4 className="font-semibold text-black-33 text-xl">
            {t("products:productDescription")}
          </h4>
          <div className="2sm:hidden video-product">
            <Image
              src={Images.productVideo.image}
              width={610}
              height={300}
              objectFit="cover"
            />
            <a
              className="btn-play"
              href={Images.productVideo.video}
              target="_blank"
            >
              <FaPlay className="text-black-33 text-[24px] icon-play" />
            </a>
          </div>
          <p className="text-gray-66 text-[13px]">
            Lorem 
          </p>
          <div className="checklist text-[13px]">
            {checklist.map((des) => (
              <div className="flex items-center mb-2" key={des}>
                <span className="mr-1">
                  <FcCheckmark />
                </span>
                <span className="text-gray-66">{des}</span>
              </div>
            ))}
          </div>
        </Col>
        <Col className="pb-2" xs={0} sm={12}>
          <div className="video-product">
            <Image
              src={Images.productVideo.image}
              width={610}
              height={300}
              objectFit="cover"
            />
            <a
              className="btn-play"
              href={Images.productVideo.video}
              target="_blank"
            >
              <FaPlay className="text-black-33 text-[24px] icon-play" />
            </a>
          </div>
        </Col>
      </Row>
      <div className="grid xs:grid-cols-1 2xs:grid-cols-3 2xs:gap-2">
        {listFunc.map((item, index) => (
          <div>
            <h4 className="text-black-33 font-bold">
              {index + 1} . {item.title}
            </h4>
            <p className="text-gray-66 text-[13px]">{item.text}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Description;
