import { Col, message, Row } from "antd";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowForward } from "react-icons/io";
import { RiCoupon2Fill } from "react-icons/ri";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
// import { Coupon } from "src/data/coupons";
import { GetCouponsResponse } from "src/models/Coupon";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import CouponRepository from "src/repositories/CouponRepository";
interface Tab {
  key: "all" | "storefont" | "home" | "sale" | "cancel";
  tab: ReactNode;
}

interface TabBarExtraProps {}

interface CouponProps {
  couponData: GetCouponsResponse | null;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: CouponProps = {
      couponData: null,
    };

    try {
      if (session) {
        const { data: couponData } = await lastValueFrom(
          CouponRepository.getListCouponUserSave()
        );
        propsData.couponData = couponData;
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

const TabBarExtra = (props: TabBarExtraProps) => {
  const { t } = useTranslation();
  const discoverMore = useMemo(() => {
    return (
      <Link href={"#"}>
        <span className="flex items-center discover-more cursor-pointer font-medium">
          <RiCoupon2Fill className="mr-2" style={{ fontSize: "1.125rem" }} />
          {t("common:discoverMore")}
          <IoIosArrowForward className="ml-1 text-base" />
        </span>
      </Link>
    );
  }, []);

  return discoverMore;
};

const Coupon: PageComponent<CouponProps> = ({ couponData }) => {
  const { t } = useTranslation();
  const session = useSession();
  const tabList: Array<Tab> = useMemo(
    () => [
      { key: "all", tab: t("common:all") },
      { key: "storefont", tab: "Store Font" },
      {
        key: "home",
        tab: t("myAccount:seller"),
      },
      { key: "sale", tab: t("myAccount:paymentOffer") },
      { key: "cancel", tab: t("myAccount:expiration") },
    ],
    [t]
  );
  const [activeTab, setActiveTab] = useState<Tab>(tabList[0]);
  // const [coupons, setCoupons] = useState<Array<Coupon> | []>(couponsData);
  const [couponsData, setCouponsData] = useState<GetCouponsResponse | null>(
    couponData
  );

  // Call API
  const { run: getSavedCouponApi } = useJob(() => {
    return CouponRepository.getListCouponUserSave().pipe(
      map(({ data }: { data: GetCouponsResponse }) => {
        console.log("get coupun success", data);
        setCouponsData(data);
      }),
      catchError((err) => {
        console.log("get coupon err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    if (session.status === "authenticated") getSavedCouponApi();
  }, [session.status]);

  // const onTabChange = useCallback(
  //   (key: string) => {
  //     const tabActive = tabList.find((item) => item.key === key);
  //     if (tabActive) {
  //       if (tabActive.key === "storefont" || tabActive.key === "sale") {
  //         setCoupons([]);
  //       } else {
  //         setCoupons(couponsData);
  //       }
  //       setActiveTab(tabActive);
  //     }
  //   },
  //   [tabList]
  // );
  const coppyCode = () => {
    message.success({
      content: t("myAccount:couponHasCopiedSuccessfully"),
      className: "custom-message-coupon",
      right: 0,
      style: {
        textAlign: "right",
      },
    });
  };

  const getExpiredDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " - " + mm + " - " + yyyy;
  };

  return (
    <div id="coupon" className="relative z-50">
      <Row gutter={20} className="mt-3">
        {couponsData && couponsData.data.length > 0 ? (
          couponsData.data.map((item) => (
            <Col xs={24} lg={12} className="mb-4 max-w-[550px]">
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
                        {item.name}
                      </div>
                      <div className="coupon__desciption text-xs text-slate-400">
                        {item.code}
                      </div>
                    </div>
                    <div className="coupon__expiry mb-[6px] w-full flex items-end justify-between text-xs text-slate-400">
                      <div>HSD: {getExpiredDate(item.expiredDate)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center py-4 w-[100%]">
            <div className="mb-4 text-xl text-center">
              {t("orderManagement:notHaveDiscountCode")}
            </div>
          </div>
        )}
      </Row>
      {/* <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTab.key}
        // tabBarExtraContent={<TabBarExtra />}
        onTabChange={(key: any) => {
          onTabChange(key);
        }}
      >
        <Row gutter={20} className="mt-3">
          {coupons && coupons.length > 0 ? (
            coupons.map((item) => (
              <Col xs={24} lg={12} className="mb-4 max-w-[550px]">
                <div className="coupon h-[120px] flex border rounded-[10px]">
                  <div className="coupon__img relative w-[30%] max-w-[135px]">
                    <div className="coupon__shape-top absolute"></div>
                    <div className="coupon__shape-bottom absolute"></div>
                    <div className="text-[11px] text-center pt-2">
                      <img className="block w-[60px] mb-1" src={item.image} />
                      {item.name}
                    </div>
                  </div>
                  <div className="coupon__content flex-1 p-3 pl-5 pr-3 border-l border-dashed">
                    <div className="flex justify-between items-start">
                      <div>
                        <div
                          className={
                            item.isApp
                              ? "coupon__for-app text-xs inline-block p-1 rounded-[3px]"
                              : "hidden"
                          }
                        >
                          Chỉ cho App
                        </div>
                        <div className="coupon__deal font-semibold">
                          {item.deal}
                        </div>
                        <div className="coupon__desciption text-xs text-slate-400">
                          {item.forOrder}
                        </div>
                      </div>
                      <div className="cursor-pointer relative coupon__dropdown mt-1">
                        <AiOutlineInfoCircle
                          style={{ fontSize: "1.125rem", color: "#336699" }}
                        />
                        <div className="coupon__info absolute min-w-[400px] rounded-[8px] py-3">
                          <div className="coupon__item p-3 flex items-center">
                            <div className="min-w-[120px] font-medium">Mã</div>
                            {item.code}
                            <Button
                              className="ml-3 coupon__copy-btn text-center"
                              onClick={coppyCode}
                            >
                              <AiOutlineCopy />
                            </Button>
                          </div>
                          <div className="coupon__item p-3 flex">
                            <div className="min-w-[120px] font-medium">
                              {t("orderManagement:expiration")}
                            </div>
                            {item.expiry}
                          </div>
                          <div className="coupon__item p-3">
                            <span className="font-medium">
                              {t("orderManagement:condition")}
                            </span>
                            <ul className="list-disc pl-5 mt-2 mb-0">
                              {item.condition.map((condition) => (
                                <li className="text-[13px]">{condition}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="coupon__expiry text-xs text-slate-400 absolute bottom-[11px]">
                      HSD: {item.expiry}
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center py-4 w-[100%]">
              <div className="mb-4 text-xl text-center">
                {t("orderManagement:notHaveDiscountCode")}
              </div>
            </div>
          )}
        </Row>
      </Card> */}
    </div>
  );
};

Coupon.getLayout = (page: any) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Coupon;
