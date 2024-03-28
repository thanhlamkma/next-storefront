import { Button, Col, Divider, Row } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import Container from "src/components/Container";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { GetCartResponse } from "src/models/Carts";
import { GetDetailOrderResponse } from "src/models/Order";
import { RootReducer } from "src/redux";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import OrderRepository from "src/repositories/OrderRepository";

interface SuccessPageProps {
  cartData: GetCartResponse;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    const session = await getSession(context);

    try {
      const { data: cartData } = await lastValueFrom(CartRepository.get());

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          cartData,
        },
      };
    } catch (e) {
      console.log("err", e);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
        },
      };
    }
  }
);

const Success: PageComponent<SuccessPageProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cartData, setCartData] = useState<GetCartResponse>(props.cartData);
  const [detailOrder, setDetailOrder] = useState<GetDetailOrderResponse>();

  const dispatch = useDispatch();
  const { setCart } = cartModule.actions.creators;

  // Call API
  const { run: getOrderApi } = useJob(() => {
    return OrderRepository.getDetailOrder(Number(router.query?.id)).pipe(
      map(({ data }: { data: GetDetailOrderResponse }) => {
        console.log("get order success", data);
        setDetailOrder(data);
      }),
      catchError((err) => {
        console.log("get oder err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    const cart: {
      productId: number;
      quantity: number;
      unitPrice: number;
    }[] = [];
    if (cartData) {
      cartData.cartItems.map((item) => {
        cart.push({
          productId: item.productId,
          quantity: item.productUomQty,
          unitPrice: item.priceUnit,
        });
      });
    }
    dispatch(setCart(cart));
    if (router.query.id) {
      getOrderApi();
    }
  }, []);

  const getExpiredDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " / " + mm + " / " + yyyy;
  };

  return (
    <>
      <Head>
        <title>{t("cart:orderResult")}</title>
      </Head>
      <Container>
        {detailOrder ? (
          <div
            id="order-result"
            className="md:w-[75%] lg:w-[55%] mx-auto mt-14 mb-6 rounded-[6px] bg-gray-100"
          >
            <div
              className="title md:h-[120px] h-[80px] px-16 flex flex-col gap-1 justify-center items-center rounded-t-[6px] bg-[#2d6dec] text-white"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,198,255,1) 32%, rgba(1,138,240,1) 48%, rgba(3,93,217,1) 67%);",
              }}
            >
              <p className="sm:text-lg md:text-xl lg:text-[24px] text-base font-bold">
                {" "}
                {t("order:orderSuccess")}
              </p>
              <p className="md:text-base lg:text-[18px] text-sm">
                {" "}
                {t("order:prepareCash")}{" "}
                {t("utilities:currency", {
                  val: detailOrder.amountTotal,
                })}
              </p>
            </div>
            <div className="pt-10 pb-6 sm:px-6 md:px-10 lg:px-16 px-4">
              <div className="flex flex-col gap-2 mb-5">
                <p className="sm:text-base text-sm font-semibold">
                  {t("order:orderCode")}: {detailOrder.id}
                </p>
                <Divider className="m-0" />
                <p className="sm:text-sm text-xs">
                  {t("order:orderDate")}:{" "}
                  {getExpiredDate(detailOrder.orderDate)}
                </p>
                <ul className="mt-2 sm:text-sm text-xs">
                  {detailOrder.orderLines.map((item) => (
                    <li className="mb-3 flex items-center gap-3 ">
                      {/* <Image
                        src={Images.product.noProductImg}
                        objectFit="contain"
                        width={60}
                        height={70}
                      /> */}
                      <p>{item.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <Divider className="m-0 p-2" />
              <div className="flex flex-col gap-2 sm:text-sm text-xs">
                <Row>
                  <Col span={12}>{t("order:payments")} :</Col>
                  <Col className="text-right" span={12}>
                    {t("cart:cashMoney")}
                  </Col>
                </Row>
                <Row className="mb-3 font-semibold">
                  <Col span={12}>{t("order:sum")} :</Col>
                  <Col className="text-right" span={12}>
                    {t("utilities:currency", {
                      val: detailOrder.amountTotal,
                    })}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className="mb-10 md:w-[75%] lg:w-[55%] mx-auto flex items-center justify-center continue-shoping-btn mt-5 px-[28px] py-[13px] text-[#fff] bg-[#333] font-medium rounded-[3px] hover:opacity-90"
          onClick={() => router.push("/")}
        >
          <BiArrowBack className="mr-[10px]" fontSize={20} />
          <span className="uppercase text-[14.8px] leading-[16px]">
            {t("order:backToHome")}
          </span>
        </div>
      </Container>
    </>
  );
};

Success.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Success;
