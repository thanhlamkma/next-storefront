import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";
import Images from "src/assets/images";
import { Rating } from "src/components";
import { CreateResponse } from "src/models/Partner";

interface InfoVendor {
  name: string;
  star: number;
  reviewer: string | number;
  storeName: string;
  address: string;
  phone: string | number;
}

interface VendorInfoProps {
  vendorDetail?: CreateResponse | null;
}

const VendorInfo = (props: VendorInfoProps) => {
  const { t } = useTranslation();
  return (
    <div id="vendor-info">
      {props.vendorDetail ? (
        <Row gutter={[40, 20]} className="mb-8">
          <Col xs={24} md={12}>
            <Image
              className="rounded-lg"
              src={Images.banner.bannerVendor}
              width={600}
              height={360}
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="flex items-center gap-4 mb-4">
              {/* <div className="rounded-sm border-[1px] border-solid border-gray-ee">
              <Image
                src={Images.partner.oaio}
                width={80}
                height={80}
                objectFit="contain"
              />
            </div> */}
              <div>
                <h4 className="font-semibold text-black-33 text-[18px] my-[3px]">
                  {props.vendorDetail.name}
                </h4>
                {/* <Rating
                className="mb-4"
                allowHalf
                defaultValue={4}
                disabled
                count={5}
                reviews={3}
              /> */}
              </div>
            </div>
            <Row className="mb-6">
              <Col span={24}>
                <Row>
                  <Col className="max-w-[120px] mb-2" span={10}>
                    {t("partner:vendorName")}:
                  </Col>
                  <Col className="mb-2" span={14}>
                    {props.vendorDetail.name}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col className="max-w-[120px] mb-2" span={10}>
                    {t("partner:address")}:
                  </Col>
                  <Col className="mb-2" span={14}>
                    {props.vendorDetail.street}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col className="max-w-[120px] mb-2" span={10}>
                    {t("partner:phone")}:
                  </Col>
                  <Col className="mb-2" span={14}>
                    {props.vendorDetail.phone}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col className="max-w-[120px] mb-2" span={10}>
                    Mail:
                  </Col>
                  <Col className="mb-2" span={14}>
                    {props.vendorDetail.email}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center pt-5 pb-2">
          {/* <SmileOutlined className="text-[50px] opacity-25" /> */}
          <p className="mb-2 text-base text-gray-400">
            {t("products:noSupplier")}
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorInfo;
