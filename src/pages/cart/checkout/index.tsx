import { Col, Modal, Radio, RadioChangeEvent, Row, Spin } from "antd";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowNarrowRight } from "react-icons/hi";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { RiCloseFill } from "react-icons/ri";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import Container from "src/components/Container";
import Layout from "src/components/layout";
import CheckoutLayout from "src/components/layout/CheckoutLayout";
import AddressModal from "src/components/modal/CustomerInfo";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import {
  AddShippingRequest,
  GetCartResponse,
  AddItemResponse,
  AddCouponRequest,
} from "src/models/Carts";
import { GetCouponsResponse } from "src/models/Coupon";
import { GetDetailAddressResponse } from "src/models/Partner";
import CartRepository from "src/repositories/CartRepository";
import CouponRepository from "src/repositories/CouponRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import toast from "src/services/toast";
import {
  CreateRequest as CreateAddressRequest,
  UpdateRequest as UpdateRequestAddress,
} from "src/models/Partner";
import { useRouter } from "next/router";
import OrderRepository from "src/repositories/OrderRepository";
import { GetDetailOrderResponse } from "src/models/Order";
import { DetailStateResponse } from "src/models/Common";
import CommonRepository from "src/repositories/CommonRepository";
import LoginModal from "src/components/modal/LoginForm";
import ProductRepository from "src/repositories/ProductRepository";
import {
  UpdateListQuantityRequest,
  UpdateQuantityRequest,
} from "src/models/Product";

type Props = {
  cartData: GetCartResponse | null;
  addressData: GetDetailAddressResponse | null;
  detailState: DetailStateResponse | null;
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    const session = await getSession(context);

    let propsData: Props = {
      cartData: null,
      addressData: null,
      detailState: null,
    };

    try {
      const { data: cartData } = await lastValueFrom(CartRepository.get());
      propsData.cartData = cartData;

      const { data: listAddressData } = await lastValueFrom(
        PartnerRepository.getListAddress({})
      );

      let partnerId: number = 0;
      listAddressData.data.map((item) => {
        if (item.isDefault) {
          partnerId = item.id;
        }
      });

      if (partnerId !== 0) {
        const { data: addressData } = await lastValueFrom(
          PartnerRepository.getDetailAddress(partnerId)
        );
        propsData.addressData = addressData;

        if (propsData.addressData.stateId) {
          const { data: detailState } = await lastValueFrom(
            CommonRepository.getDetailState(propsData.addressData.stateId)
          );
          propsData.detailState = detailState;
        }
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (e) {
      console.log("err", e);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

type CheckoutRightSideProp = {
  setOnEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalAuth: React.Dispatch<React.SetStateAction<boolean>>;
  cartData?: GetCartResponse | null;
  addressData?: GetDetailAddressResponse | null;
  totalPrice: number;
  onSubmitOrder: () => void;
};

const CheckoutRightSide = ({
  setOnEdit,
  cartData,
  totalPrice,
  addressData,
  onSubmitOrder,
  setOpenModalAuth,
}: CheckoutRightSideProp) => {
  const { t } = useTranslation();
  const session = useSession();
  // const [modalAuth, setModalAuth] = useState<boolean>(false);

  const handleClick = () => {
    onSubmitOrder();
  };

  return (
    <div className="cart-shipping-info-side w-[100%] px-[30px] pt-[23px] pb-[40px]">
      <h1 className="cart-total-text uppercase text-[20px] font-bold pb-[21px]">
        {t("common:yourOrder")}
      </h1>
      <div className="sub-total">
        <p className="font-semibold text-[16px] pb-[4px] mb-[12px] border-b-[1px] border-b-solid border-b-border-color">
          {t("common:product")}
        </p>
        <ul className="list-buy-product mb-[8px]">
          {cartData ? (
            <>
              {cartData.cartItems.map((product) => {
                return (
                  <li
                    className="flex justify-between py-[8px]"
                    key={`${product.name}-checkout`}
                  >
                    <span className="flex items-center">
                      {product.productUomQty} <RiCloseFill fontSize={14} />
                      {product.name}
                    </span>
                    <span className="font-semibold">
                      {t("utilities:currency", {
                        val: product.priceUnit * product.productUomQty,
                      })}
                    </span>
                  </li>
                );
              })}
            </>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="sub-total flex justify-between font-semibold text-[16px] pb-[16px] border-b-[1px] border-b-solid border-b-border-color">
        <span>{t("cart:subtotal")}</span>
        <span>{t("utilities:currency", { val: totalPrice })}</span>
      </div>
      <div className="shipping-info mt-[24px]">
        <h1 className="font-semibold text-[16px] mb-[16px]">
          {t("cart:shipping")}
        </h1>
        <p className="text-[15px] text-[#666] mb-[12px] flex justify-between">
          <span> {t("cart:shippingAddress")}</span>
          <span
            className="cursor-pointer font-medium"
            onClick={() => {
              if (session.status === "authenticated") setOnEdit(true);
              else setOpenModalAuth(true);
              // router.push({ pathname: "/auth/login" });
            }}
          >
            {t("common:edit")}
          </span>
        </p>

        {addressData ? (
          <>
            <p className="text-[16px] text-[#333] font-semibold mb-[4px]">
              <span>{addressData.name}</span>
              <span className="flex-1 ml-[24px]">{addressData.phone}</span>
            </p>

            <p className="customer-address text-[13.5px] text-[#666] mb-[4px]">
              {addressData.street},&nbsp;{addressData.street2}
            </p>
          </>
        ) : (
          ""
        )}
        <div
          className="proceed-to-checkout-btn cursor-pointer flex items-center justify-center mt-8 py-[14px] text-[white]  bg-[#ff424e] rounded-[3px] hover:opacity-90"
          onClick={handleClick}
        >
          <span className="uppercase text-[14px] leading-[16px] font-semibold">
            {t("cart:placeOrder")}
          </span>
          <HiArrowNarrowRight className="ml-[6px]" fontSize={20} />
        </div>
      </div>
    </div>
  );
};

type ChooseShippingProps = {
  deliverOption: string;
  cartData: GetCartResponse | null;
  couponData?: GetCouponsResponse;
  onChangeShipping: (value: string) => void;
  onChangeCoupon: (value: string) => void;
  deliveryAmount?: number;
};

const ChooseShippingMethod = ({
  deliverOption,
  cartData,
  couponData,
  onChangeShipping,
  onChangeCoupon,
}: ChooseShippingProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>(deliverOption);
  const [showSavedCoupon, setShowSavedCoupon] = useState<boolean>(false);
  const [chosenCoupon, setChosenCoupon] = useState<string>("");

  const handleChangeShipping = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    onChangeShipping(e.target.value);
  };

  const handleChangeCoupon = (code: string) => {
    setChosenCoupon(code !== chosenCoupon ? code : "");
    onChangeCoupon(code);
  };

  const getExpiredDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " - " + mm + " - " + yyyy;
  };

  return (
    <div className="shipping-method-wrapper">
      <h1 className="title uppercase text-[20px] font-bold pb-[21px]">
        {t("cart:chooseShippingMethod")}
      </h1>
      <div className="shipping-method-container px-[20px] py-[16px] mb-[16px]">
        <Radio.Group
          className="w-full mb-1 flex flex-col gap-1"
          value={value}
          onChange={handleChangeShipping}
        >
          <Radio
            className="shipping-method xs:w-[100%] xs:max-w-[450px] md:max-w-[60%] md:w-[60%] mb-[8px]"
            value="xteam"
          >
            <div className="ml-[20px] flex items-center gap-2">
              {/* <div className="w-[60px]">
                <Image
                  className="w-[100%]"
                  objectFit="contain"
                  src={Images.logo.shippingWayLogo.tikiNow}
                  width={148}
                  height={48}
                />
              </div> */}
              <span className="flex-1">{t("order:fastDelivery")}</span>
            </div>
          </Radio>
          <Radio
            className="shipping-method xs:w-[100%] xs:max-w-[450px] md:max-w-[60%] md:w-[60%] mb-[8px]"
            value="none"
          >
            <div className="ml-[20px] flex items-center gap-2">
              {/* <div className="w-[60px]">
                <Image
                  className="w-[100%]"
                  objectFit="contain"
                  src={Images.logo.shippingWayLogo.tikiFast}
                  width={148}
                  height={48}
                />
              </div> */}
              <span>{t("order:saveDelivery")}</span>
            </div>
          </Radio>
        </Radio.Group>
        <div className="product-shipping-info-wrapper">
          {cartData ? (
            <>
              <Row className="product-shipping-info" gutter={[10, 18]}>
                <Col
                  md={{
                    span: 16,
                  }}
                  sm={{
                    span: 24,
                  }}
                  span={24}
                >
                  {value === "none" ? (
                    <div className="shipping-unit flex items-center justify-between">
                      <div className="flex items-center">
                        {/* <div className="shipping-unit-logo w-[60px] mr-[8px] ">
                          <Image
                            className="w-[100%]"
                            objectFit="contain"
                            src={Images.logo.shippingWayLogo.tikiFast}
                            width={168}
                            height={48}
                          />
                        </div> */}
                        <span>{t("order:saveDelivery")}</span>
                      </div>
                      <div className="font-semibold">
                        {t("utilities:currency", {
                          val:
                            cartData && cartData.cartShipping
                              ? cartData.cartShipping.deliveryCarrierAmount
                              : "",
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="shipping-unit flex items-center justify-between">
                      <div className="flex items-center">
                        {/* <div className="shipping-unit-logo w-[60px] mr-[8px] ">
                          <Image
                            className="w-[100%]"
                            objectFit="contain"
                            src={Images.logo.shippingWayLogo.tikiNow}
                            width={168}
                            height={48}
                          />
                        </div> */}
                        <span>{t("order:fastDelivery")}</span>
                      </div>
                      <div className="font-semibold">
                        {t("utilities:currency", {
                          val:
                            cartData && cartData.cartShipping
                              ? cartData.cartShipping.deliveryCarrierAmount
                              : "",
                        })}
                      </div>
                    </div>
                  )}
                </Col>
                {cartData.cartItems.map((product) => {
                  return (
                    <Col
                      key={`shipping-${product.name}`}
                      className="product-side flex"
                      md={{
                        span: 16,
                      }}
                      sm={{
                        span: 24,
                      }}
                      span={24}
                    >
                      <div className="product-img w-[75px] aspect-square mr-[12px]">
                        <Image
                          className="w-[100%]"
                          src={
                            product.image
                              ? product.image
                              : Images.product.noProductImg
                          }
                          width={300}
                          height={338}
                          objectFit="contain"
                        />
                      </div>
                      <div className="product-info flex-1 text-[14px]">
                        <h1 className="shipping-product-name mb-[20px] font-medium text-gray-600">
                          {product.name}
                        </h1>
                        <div className="quantity-and-price flex justify-between text-gray-400">
                          <p>
                            <span>{t("order:quantity")}:</span>{" "}
                            {product.productUomQty}
                          </p>
                          <span>
                            {t("utilities:currency", {
                              val: product.priceUnit,
                            })}
                          </span>
                        </div>
                      </div>
                    </Col>
                  );
                  {
                    /* <Col
                      md={{
                        span: 11,
                        offset: 1,
                      }}
                      sm={{
                        span: 24,
                      }}
                      span={24}
                      className="shipping-info-side"
                    >
                      <div className="shipping-unit flex">
                        <div className="shipping-unit-logo w-[60px] mr-[8px] ">
                          <Image
                            className="w-[100%]"
                            objectFit="contain"
                            src={Images.logo.shippingWayLogo.tikiFast}
                            width={168}
                            height={48}
                          />
                        </div>
                        <span>{t("order:saveDelivery")}</span>
                      </div>
                      <div className="mt-4 time-and-cost text-[15px] flex justify-between mb-[12px]">
                        <span className="shipping-time font-semibold text-[#666]">
                          Ship at Friday, Marth 13th
                        </span>
                        <span className="shipping-cost font-semibold">
                          {t("utilities:currency", {
                            val: product.priceUnit * product.productUomQty,
                          })}
                        </span>
                      </div>
                    </Col> */
                  }
                })}
              </Row>
            </>
          ) : (
            ""
          )}
        </div>
        <div
          className="coupon mt-4 flex items-center gap-2 cursor-pointer"
          onClick={() => setShowSavedCoupon(true)}
        >
          <span className="text-sm">{t("order:shopPromotion")}</span>
          <span className="text-xs text-gray-400">{t("order:enterCode")}</span>
          <MdOutlineArrowForwardIos className="text-gray-400" size={16} />
        </div>
        <Modal
          className="modalCoupon"
          visible={showSavedCoupon}
          title={
            <p className="mt-2 mb-1 text-center text-[20px] font-semibold">
              {t("products:coupon")}
            </p>
          }
          onCancel={() => setShowSavedCoupon(false)}
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
          modalRender={(node: ReactNode) => node}
        >
          {couponData?.data.map((coupon) => (
            <div className="coupon h-[120px] flex border rounded-[10px]">
              <div className="coupon__img relative w-[30%] max-w-[135px]">
                <div className="coupon__shape-top absolute"></div>
                <div className="coupon__shape-bottom absolute"></div>
                <div className="h-full flex flex-col items-center justify-center pt-2 text-[12px]">
                  <img
                    className="block w-[60px] mb-1"
                    src={Images.logo.pageWolmartLogoPC}
                  />
                </div>
              </div>
              <div className="coupon__content flex-1 p-2 pl-5 pr-3 border-l border-dashed">
                <div className="h-full flex flex-col justify-between items-start">
                  <div>
                    <div className="coupon__deal font-semibold">
                      {coupon.name}
                    </div>
                    <div className="coupon__desciption text-xs text-slate-400">
                      {coupon.code}
                    </div>
                  </div>
                  <div className="coupon__expiry mb-[6px] w-full flex items-end justify-between text-xs text-slate-400">
                    <div>HSD: {getExpiredDate(coupon.expiredDate)}</div>
                    {/* {coupon.isSave ? (
                    <Image src={Images.icons.isSaved} width={60} height={60} />
                  ) : ( */}
                    <div
                      className="py-[4px] px-[14px] border rounded-md bg-[#017fff] text-sm text-white font-semibold cursor-pointer hover:opacity-80"
                      onClick={() => handleChangeCoupon("oke")}
                    >
                      {coupon.code === chosenCoupon ? (
                        <>{t("order:unchecked")}</>
                      ) : (
                        <>{t("order:apply")}</>
                      )}
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

const ChoosingPaymentMethod = () => {
  const { t } = useTranslation();
  return (
    <div className="payment-method-wrapper mb-10">
      <h1 className="title uppercase text-[20px] font-bold pb-[21px]">
        {t("cart:choosePaymentMethod")}
      </h1>
      <div className="payment-method-container">
        <Radio.Group className="list-payment-method ml-2">
          <Radio className="payment-method flex items-center gap-3">
            {/* <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} /> */}
            <div className="flex items-center gap-2">
              <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
                <Image
                  className="w-[100%]"
                  src={Images.icons.paymentIcon.codPaymentMethodIcon}
                  width={32}
                  height={32}
                  objectFit="contain"
                />
              </div>
              <span className="payment-method-text flex-1">
                {t("cart:cashMoney")}
              </span>
            </div>
          </Radio>

          {/* <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.viettelPaymentMethodIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <span className="payment-method-text flex-1">
              {t("cart:cashViettelMoney")}
            </span>
          </li>

          <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.momoPaymentMethodIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <span className="payment-method-text flex-1">
              {t("cart:cashMomo")}
            </span>
          </li>

          <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.zalopayPaymentMethodIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <span className="payment-method-text">{t("cart:cashZalopay")}</span>
            <span className="discount-zalo-text">
              <span className="text-[12px] leading-[14px]">
                {t("common:discount")} 10k
              </span>{" "}
              <AiOutlineInfoCircle className="ml-[4px]" fontSize={16} />
            </span>
          </li>

          <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.vnpayPaymentMethodIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <p className="payment-method-text flex-1 flex flex-col">
              <span>{t("cart:cashVnpay")}</span>
              <span className="text-[12px] text-[#666]">
                {t("cart:scanQRBank")}
              </span>
            </p>
          </li>
          
          <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.creditPaymentMethodIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <div className="payment-method-text flex-1 flex flex-col">
              <span>{t("cart:cashCard")}</span>
              <div className="credit-icon flex">
                <div className="w-[28px] aspect-square mr-[6px]">
                  <Image
                    className="w-[100%]"
                    src={Images.icons.paymentIcon.tikiPaymentIcon}
                    width={28}
                    height={28}
                  />
                </div>
                <div className="w-[28px] aspect-square mr-[6px]">
                  <Image
                    className="w-[100%]"
                    src={Images.icons.paymentIcon.visaPaymentIcon}
                    width={28}
                    height={28}
                  />
                </div>
                <div className="w-[28px] aspect-square mr-[6px]">
                  <Image
                    className="w-[100%]"
                    src={Images.icons.paymentIcon.masterCardPaymentIcon}
                    width={28}
                    height={28}
                  />
                </div>
                <div className="w-[28px] aspect-square mr-[6px]">
                  <Image
                    className="w-[100%]"
                    src={Images.icons.paymentIcon.typeJobPaymentIcon}
                    width={32}
                    height={32}
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          </li>

          <div className="deals-card-payment-wrapper  pl-[24px] w-[100%]">
            <div className="deals-card-payment p-[16px] bg-[#efefef] w-[100%]">
              <h1 className="deals-title flex items-center mb-[12px]">
                <Image
                  src={Images.icons.paymentIcon.dealsIcon}
                  width={20}
                  height={20}
                />
                <span className="ml-[4px] text-hover-color">
                  {t("cart:cardPaymentOffers")}
                </span>
              </h1>

              <ul className="list-deals flex flex-wrap">
                {dealsData.map((deal, index) => {
                  return (
                    <li
                      key={`deal-${index}`}
                      className="deals px-[12px] py-[8px] flex flex-col w-[225px] mr-[8px] mb-[8px] bg-white h-[87px] rounded-[3px] hover:opacity-90 cursor-pointer"
                    >
                      <div className="deals-first-row flex justify-between items-center mb-[2px]">
                        <h1 className="deals-title text-[16px] font-medium text-[#0d5cb6]">
                          {deal.title}
                        </h1>
                        <div className="deals-bank-logo w-[72px] h-[30px]">
                          <Image
                            className="w-100[%]"
                            width={72}
                            height={30}
                            src={deal.bankLogo}
                            objectFit="contain"
                          />
                        </div>
                      </div>
                      <div className="deals-second-row flex justify-between mb-[2px]">
                        <span className="deals-require max-w-[75%] text-[12px]">
                          {deal.require}
                        </span>
                        <AiOutlineInfoCircle fontSize={18} />
                      </div>
                      <span className="deals-left italic text-[12px]">
                        {deal.left}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <li className="payment-method flex items-center">
            <IoIosRadioButtonOff className="mr-[6px]" fontSize={26} />
            <div className="payment-method-icon w-[32px] aspect-square mr-[6px]">
              <Image
                className="w-[100%]"
                src={Images.icons.paymentIcon.atmPaymentIcon}
                width={32}
                height={32}
                objectFit="contain"
              />
            </div>
            <span className="payment-method-text">
              {t("cart:cashATMDomestic")}
            </span>
          </li> */}
        </Radio.Group>
      </div>
    </div>
  );
};

const Checkout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession();
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [cartData, setCartData] = useState<GetCartResponse | null>(
    props.cartData
  );
  const [addressData, setAddressData] =
    useState<GetDetailAddressResponse | null>(props.addressData);
  const [couponData, setCouponData] = useState<GetCouponsResponse>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shipping, setShipping] = useState<string>("xteam");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  // Call API
  const { run: updateQuantityApi } = useJob(
    (data: UpdateListQuantityRequest) => {
      return ProductRepository.updateQuantityAvailable(data).pipe(
        map((data) => {
          console.log("update success", data);
        }),
        catchError((err) => {
          console.log("update err", err);
          return of(err);
        })
      );
    }
  );

  const { run: addShippingApi } = useJob((data: AddShippingRequest) => {
    return CartRepository.addShippingToCart(data).pipe(
      map(({ data }: { data: AddItemResponse }) => {
        setCart(data.userCart);
      }),
      catchError((err) => {
        console.log("add shipping err", err);
        return of(err);
      })
    );
  });

  const { run: getSavedCouponApi } = useJob(() => {
    return CouponRepository.getListCouponUserSave().pipe(
      map(({ data }: { data: GetCouponsResponse }) => {
        console.log("get saved coupon success", data);
        setCouponData(data);
      }),
      catchError((err) => {
        console.log("get saved coupon err", err);
        return of(err);
      })
    );
  });

  const { run: addCouponApi } = useJob((data: AddCouponRequest) => {
    return CartRepository.addCouponToCart(data).pipe(
      map(({ data }: { data: AddItemResponse }) => {
        console.log("add coupon success", data);
        setCart(data.userCart);
      }),
      catchError((err) => {
        console.log("add coupon err", err);
        return of(err);
      })
    );
  });

  const { run: createAddress } = useJob((newAddress: CreateAddressRequest) => {
    return PartnerRepository.create(newAddress).pipe(
      map(({ data }) => {
        if (data.id) {
          toast.show("info", t("common:createSuccess"));
          setOnEdit(false);
          setAddressData({
            id: data.id,
            companyId: data.companyId,
            countryId: data.countryId,
            isCompany: data.isCompany,
            isDefault: data.active,
            name: data.name,
            phone: data.phone,
            stateId: data.stateId,
            street: data.street,
            street2: data.street2,
            userId: data.userId,
          });
        }
      }),
      catchError((err: any) => {
        toast.show("error", t("common:createError"));
        return of(err);
      })
    );
  });

  const { run: updateAddress } = useJob((address: UpdateRequestAddress) => {
    return PartnerRepository.update(
      addressData?.id || address.id,
      address
    ).pipe(
      map(({ data }) => {
        if (data.id) {
          toast.show("info", t("common:updateSuccess"));
          setOnEdit(false);
          setAddressData({
            id: data.id,
            companyId: data.companyId,
            countryId: data.countryId,
            isCompany: data.isCompany,
            isDefault: data.active,
            name: data.name,
            phone: data.phone,
            stateId: data.stateId,
            street: data.street,
            street2: data.street2,
            userId: data.userId,
          });
        }
      }),
      catchError((err: any) => {
        toast.show("error", t("common:updateError"));
        return of(err);
      })
    );
  });

  const { run: createOrderApi } = useJob(() => {
    return OrderRepository.createOrder().pipe(
      map(({ data }: { data: GetDetailOrderResponse }) => {
        var quantities: UpdateQuantityRequest[] = [];
        cartData?.cartItems.map((item) => {
          quantities.push({
            productTmplId: item.productTemplateId,
            qtyAvailable: item.productUomQty,
          });
        });
        updateQuantityApi({ productInfo: quantities });
        setTimeout(() => {
          router.push(`/cart/checkout/success?id=${data.id}`);
        }, 500);
      }),
      catchError((err) => {
        console.log("create order err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    if (cartData) {
      setCart(cartData);
    }

    if (addressData) {
      setLoading(true);
      setTimeout(() => {
        addShippingApi({
          deliverOption: shipping,
          partnerShippingId: addressData.id,
        });
        setLoading(false);
      }, 500);
    }

    if (session.status === "authenticated") {
      // getSavedCouponApi();
    }
  }, []);

  // Set cart
  const setCart = (data: GetCartResponse) => {
    setCartData(data);
    setTotalPrice(data.amountTotal);
  };

  // Handle change shipping
  const handleChangeShipping = (shippingOpt: string) => {
    setShipping(shippingOpt);
    if (addressData) {
      setLoading(true);
      addShippingApi({
        deliverOption: shippingOpt,
        partnerShippingId: addressData.id,
      });
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    } else {
      toast.show("error", t("order:noAddress"));
    }
  };

  const handleChangeCoupon = (coupon: string) => {
    if (appliedCoupon === "") setAppliedCoupon(coupon);
    // if (coupon !== appliedCoupon) {
    //   addCouponApi({
    //     couponCode: appliedCoupon,
    //     isAdd: false,
    //   });
    //   setTimeout(() => {
    //     addCouponApi({
    //       couponCode: coupon,
    //       isAdd: false,
    //     });
    //     setAppliedCoupon(coupon);
    //   }, 1000);
    // }
    console.log("coupon", coupon);
  };

  // Handle submit address
  const handleSubmitAddress = (data: CreateAddressRequest) => {
    if (addressData?.id) {
      const newAddress: any = {
        id: addressData.id,
        isCompany: data.isCompany,
        isDefault: true,
        name: data.name,
        street: data.street,
        phone: data.phone,
        stateId: data.stateId,
        street2: data.street2,
      };
      updateAddress(newAddress);
      setAddressData(newAddress);
    } else {
      createAddress(data);
    }
  };

  // Handle create order
  const handleSubmitOrder = () => {
    if (cartData && cartData.cartShipping) {
      createOrderApi();
    } else {
      toast.show("error", "Vui lòng chọn phương thức giao hàng");
    }
  };

  return (
    <>
      <Head>
        <title>{t("cart:checkout")}</title>
      </Head>
      <Container className="checkout mb-[20px] pb-[20px]">
        <Spin spinning={loading}>
          <Row className="w-[100%]">
            <Col
              xs={24}
              lg={16}
              className="cart-products-side xs:pr-0 mlg:pr-[36px]"
            >
              <ChooseShippingMethod
                deliverOption={shipping}
                cartData={cartData}
                couponData={couponData}
                onChangeShipping={handleChangeShipping}
                onChangeCoupon={handleChangeCoupon}
                // deliveryAmount={cartData.cartShipping.deliveryCarrierAmount}
              />
              <ChoosingPaymentMethod />
            </Col>
            <Col xs={24} lg={8} className="cart-shipping-info-side-wrapper">
              <CheckoutRightSide
                setOpenModalAuth={setModalAuth}
                setOnEdit={setOnEdit}
                cartData={cartData}
                totalPrice={totalPrice}
                addressData={addressData}
                onSubmitOrder={handleSubmitOrder}
              />
            </Col>
          </Row>
        </Spin>
      </Container>
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
      <AddressModal
        className="customer-infor-modal"
        onSubmitAddress={handleSubmitAddress}
        detailAddess={addressData}
        detailState={props.detailState}
        title={
          <p className="text-center text-[16px] font-semibold">
            {t("order:customerInfo")}
          </p>
        }
        onCancel={() => setOnEdit(false)}
        visible={onEdit}
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
    </>
  );
};

Checkout.getLayout = (page: any) => {
  return (
    <Layout>
      <CheckoutLayout>{page}</CheckoutLayout>
    </Layout>
  );
};

export default Checkout;
