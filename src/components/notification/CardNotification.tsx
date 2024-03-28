import { Col, Row } from "antd";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { Notification } from "src/data/notifications";

interface CardNotificationProps extends Notification {}

const CardNotification = ({
  id,
  time,
  content,
  linkContent,
}: CardNotificationProps) => {
  const { t } = useTranslation();

  return (
    <div id="cardNotification" className="mb-4">
      <Row gutter={16}>
        <Col span={3}>
          <div className="flex items-center h-full">
            <span className="text-[13px] text-gray-66">{time}</span>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <p className="text-[13px] text-gray-66 text-justify">
            {content} .
            <Link href={linkContent}>
              <a className="ml-1 text-blue-500 cursor-pointer">
                {t("common:detail")}
              </a>
            </Link>
          </p>
        </Col>
        <Col xs={24} md={5} className="xxs:mb-2 md:mb-0">
          <div className="flex xxs:justify-between sm:justify-end">
            <div className="text-sm text-blue-500 cursor-pointer font-semibold mr-2">
              {t("notification:maskRead")}
            </div>
            <div className="text-sm font-semibold text-red-500 cursor-pointer">
              {t("common:delete")}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CardNotification;
