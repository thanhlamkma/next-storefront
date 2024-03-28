import {
  Button,
  Col,
  ColProps,
  Form,
  FormItemProps,
  Input,
  Radio,
  Row,
  RowProps,
  Tooltip,
} from "antd";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { MdOutlineCardGiftcard } from "react-icons/md";
import Images from "src/assets/images";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import InfomationCoin from "src/components/modal/InfomationCoin";
import XIcon from "src/components/XIcon";
interface CoinProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

const FormItemFlex = ({ children = <Input />, ...props }: FormItemProps) => {
  return (
    <Form.Item
      labelAlign="left"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

type RowFormItemType = {
  rowProps?: RowProps;
  colProps?: ColProps;
  childrens: [ReactNode, ReactNode];
};

const RowFormItem = ({ childrens, rowProps, colProps }: RowFormItemType) => {
  return (
    <Row {...rowProps}>
      <Col
        {...colProps}
        sm={{
          span: 11,
        }}
        xs={{
          span: 24,
          offset: 0,
        }}
      >
        {childrens[0]}
      </Col>
      <Col
        {...colProps}
        sm={{
          span: 11,
          offset: 2,
        }}
        xs={{
          span: 24,
          offset: 0,
        }}
      >
        {childrens[1]}
      </Col>
    </Row>
  );
};

const listMoney = [
  {
    id: 1,
    isActive: true,
    text: "100.000 ₫",
  },
  {
    id: 2,
    isActive: false,
    text: "200.000 ₫",
  },
  {
    id: 3,
    isActive: false,
    text: "500.000 ₫",
  },
  {
    id: 4,
    isActive: false,
    text: "1.000.000 ₫",
  },
  {
    id: 5,
    isActive: false,
    text: "2.000.000 ₫",
  },
];

const CoinManager: PageComponent = (props: CoinProps) => {
  const [info, setInfo] = useState<boolean>(false);
  const [value, setValue] = useState(1);
  const [money, setMoney] = useState("100.000 đ");
  const [payment, setPayment] = useState(true);
  const [voucher, setVoucher] = useState(true);
  const [items, setItems] = useState(listMoney);
  const inputEl = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const input: any = document.getElementById("inputInner");
    input.value.length > 0 ? setPayment(false) : setPayment(true);
  });
  function changeOrigin(): void {}
  const handleVoucher = (code: string) => {
    code.length > 0 ? setVoucher(false) : setVoucher(true);
  };
  const handlePayment = (money: string) => {
    money.length > 0 ? setPayment(false) : setPayment(true);
    setMoney(money);
  };
  const handleActive = (id: any) => {
    setItems((old) => {
      const list = [...old];
      list.forEach((item) => {
        item.id !== id ? (item.isActive = false) : (item.isActive = true);
      });
      return list;
    });
  };

  return (
    <div id="coin-manager">
      <div className="flex-item border rounded-[3px] py-3 px-4">
        <div className="coin__total-in-account flex  xs:flex-col sm:flex-row sm:items-center">
          {t("orderManagement:numberCoinsAccount")}
          <div className="coin-left flex items-center">
            <BsCoin
              className="xs mr-2 sm:mx-2"
              style={{ fontSize: "1.25rem", color: "rgb(228, 198, 31)" }}
            />
            <span className="font-bold text-xl">100</span>
          </div>
        </div>
        <div
          className="coin_description flex items-center cursor-pointer"
          onClick={() => setInfo(true)}
        >
          {t("orderManagement:whatCoin")}
          <AiOutlineQuestionCircle
            className="ml-1"
            style={{ fontSize: "1.125rem" }}
          />
        </div>
      </div>
      <div className="border rounded-[3px] py-3 px-4 mt-4">
        <div className="coin__title font-semibold flex items-center">
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] mr-2">
            <GiTwoCoins style={{ fontSize: "1.125rem", color: "#fff" }} />
          </div>
          {t("orderManagement:depositCoinsAccount")}
        </div>
        <Row gutter={60} className="mt-4">
          <Col xs={24} md={15} className="xs:mb-4 md:mb-0">
            <div className="coin__denominations xs:p-6 2sm:p-8 rounded-[14px]">
              <div className="coin__level-recharge flex items-center text-base font-semibold">
                {t("orderManagement:amountWantTopUp")}
                <Tooltip
                  placement="top"
                  title="Hạn mức tối đa 200 triệu / ngày"
                  style={{ fontSize: ".75rem" }}
                >
                  <BiInfoCircle
                    className="ml-2"
                    style={{ fontSize: "1.25rem" }}
                  />
                </Tooltip>
              </div>
              <div className="coin__enter-money">
                <Input
                  id="inputInner"
                  placeholder="0 đ"
                  value={money}
                  onChange={(e) => handlePayment(e.target.value)}
                  ref={inputEl}
                />
              </div>
              <ul className="coin__offer-money mt-4">
                {items.map((item) => (
                  <li
                    className={classNames({ active: item.isActive })}
                    onClick={() => handleActive(item.id)}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={24} md={9} className="md:border-l">
            <div className="flex-item border-b border-dasher py-3">
              {t("orderManagement:coinsReceived")}:
              <span className="coin__total flex items-center">
                <BsCoin
                  className="mx-2"
                  style={{ fontSize: ".875rem", color: "rgb(228, 198, 31)" }}
                />
                100.000
              </span>
            </div>
            <div className="flex-item py-3">
              {t("orderManagement:paymentCost")}:<span>0.0%</span>
            </div>
            <Button
              disabled={payment}
              className="account__btn px-10 mt-4 py-2 h-[40px] rounded-[3px] w-[100%] active"
            >
              {t("orderManagement:proceedToPay")}
            </Button>
            <ul className="list-disc pl-5 mt-5 mb-0">
              <li className="text-[13px]">1 vnđ = 1 Tiki Xu</li>
              <li className="text-[13px]">
                {t("orderManagement:coinsDepositedPayment")}
              </li>
              <li className="text-[13px]">
                {t("orderManagement:canNotReturned", {
                  nameCoins: "ĐH Top-up Tiki",
                })}
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <div className="border rounded-[3px] py-3 px-4 mt-4">
        <div className="coin__title font-semibold flex items-center">
          <div className="flex items-center justify-center rounded-full w-[26px] h-[26px] mr-2 blue">
            <MdOutlineCardGiftcard
              style={{ fontSize: "1.125rem", color: "#fff" }}
            />
          </div>
          {t("orderManagement:useGiftVoucher")}
        </div>
        <Form className="address-form mt-3 border-b">
          <FormItemFlex
            name="origin"
            label={t("orderManagement:chooseSupplier")}
            className="address-form__item py-2"
          >
            <Radio.Group
              onChange={changeOrigin}
              value={value}
              className="radio-type-common"
            >
              <Radio className="provider-choosing" value={1}>
                <img
                  className="h-[30px] relative top-[8px] ml-1"
                  src={Images.logo.pageWolmartLogoPC}
                />
              </Radio>
              <Radio className="provider-choosing" value={2}>
                <img
                  className="h-[30px] relative top-[8px] ml-1"
                  src={Images.logo.pageWolmartLogoPC}
                />
              </Radio>
            </Radio.Group>
          </FormItemFlex>
          <FormItemFlex
            name="code"
            label={t("orderManagement:giftVoucherCode")}
            className="address-form__item"
          >
            <div className="flex xs:flex-col 2sm:flex-row xs:w-full md:w-[425px]">
              <Input
                onChange={(e) => handleVoucher(e.target.value)}
                className="rounded-[3px]"
              />
              <Button
                disabled={voucher}
                className="account__btn px-6 xs:mt-2 2sm:mt-0 2sm:ml-3 py-2 h-[40px] rounded-[3px] active font-semibold"
              >
                <span className="text-sm">
                  {t("orderManagement:coinExchange")}
                </span>
              </Button>
            </div>
          </FormItemFlex>
        </Form>
        <div className="coin__description mt-3">
          {t("orderManagement:isNotHaveGiftVoucher")}
          <Link href="#">
            <span className="cursor-pointer ml-1">
              {t("orderManagement:pleaseClickBuy")}?
            </span>
          </Link>
        </div>
      </div>
      <InfomationCoin
        className="customer-infor-modal"
        onCancel={() => setInfo(false)}
        visible={info}
        title={
          <p className="text-center text-[16px] font-semibold">
            {t("orderManagement:whatCoin")}
          </p>
        }
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
  );
};

CoinManager.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default CoinManager;
