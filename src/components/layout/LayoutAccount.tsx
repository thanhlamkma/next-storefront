import { Col, Divider, Menu, Row } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BiCartAlt,
  BiCommentEdit,
  BiMap,
  BiRightArrow,
  BiShow,
  BiUser,
} from "react-icons/bi";
import { BsCardList, BsHeartFill, BsStarHalf } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import { useJob } from "src/core/hooks";
import { GetBaseProfileResponse } from "src/models/InfoUser";
import InfoUserRepository from "src/repositories/InfoUserRepository";

interface LayoutAccountProps {
  children: any;
}

const LayoutAccount = ({ children }: LayoutAccountProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [heigthtSidebar, setHeightSideBar] = useState<number | "auto">("auto");
  const [defaultSelectKey, setDefaultSelectKey] = useState<number | null>(null);
  const refContent = useRef<HTMLInputElement | null>(null);
  const [infoUser, setInfoUser] = useState<GetBaseProfileResponse>();

  const menuSideBar = useMemo(
    () => [
      {
        id: 1,
        label: t("myAccount:accountInformation"),
        icon: <BiUser className="text-2xl icon-menu" />,
        router: "/my-account/information",
      },
      // {
      //   id: 2,
      //   label: t("myAccount:myNotification"),
      //   icon: <BiBell className="text-2xl icon-menu" />,
      //   router: "/my-account/notification",
      // },
      {
        id: 3,
        label: t("myAccount:orderManagement"),
        icon: <BsCardList className="text-2xl icon-menu" />,
        router: "/my-account/order",
      },
      {
        id: 4,
        label: t("myAccount:address"),
        icon: <BiMap className="text-2xl icon-menu" />,
        router: "/my-account/address",
      },
      // {
      //   id: 5,
      //   label: t("myAccount:billingInformation"),
      //   icon: <BiCreditCard className="text-2xl icon-menu" />,
      //   router: "/my-account/payments",
      // },
      {
        id: 6,
        label: t("myAccount:reviewPurchasedProducts"),
        icon: <BiCommentEdit className="text-2xl icon-menu" />,
        router: "/my-account/review-products",
      },
      {
        id: 7,
        label: t("myAccount:productsReviewed"),
        icon: <BiShow className="text-2xl icon-menu" />,
        router: "/my-account/viewed-products",
      },
      {
        id: 8,
        label: t("myAccount:favoriteProduct"),
        icon: <BsHeartFill className="text-2xl icon-menu-bs" />,
        router: "/my-account/wishlist",
      },
      {
        id: 9,
        label: t("myAccount:productsToBuyLater"),
        icon: <BiCartAlt className="text-2xl icon-menu" />,
        router: "/my-account/save-later",
      },
      {
        id: 10,
        label: t("myAccount:myReview"),
        icon: <BsStarHalf className="text-2xl icon-menu" />,
        router: "/my-account/review",
      },
      {
        id: 12,
        label: t("myAccount:discountCode"),
        icon: <RiCoupon2Line className="text-2xl icon-menu" />,
        router: "/my-account/discount",
      },
      // {
      //   id: 13,
      //   label: t("myAccount:coinManagement"),
      //   icon: <BsCoin className="text-2xl icon-menu" />,
      //   router: "/my-account/coin",
      // },
    ],
    [t]
  );

  // Call API
  const { run: getUserApi } = useJob(() => {
    return InfoUserRepository.getBaseProfile().pipe(
      map(({ data }: { data: GetBaseProfileResponse }) => {
        setInfoUser(data);
      }),
      catchError((err) => {
        console.log("get user err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    if (session.status === "authenticated") getUserApi();
  }, [session.status]);

  useEffect(() => {
    const currentPathName = router.pathname;
    const currentRouterRecord = menuSideBar.find((item) =>
      currentPathName.includes(item.router)
    );
    if (currentRouterRecord) {
      setDefaultSelectKey(currentRouterRecord.id);
    }
  }, [router.pathname]);

  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  const handleToggleSidebar = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  const handleMaskSidebarClick = useCallback(() => {
    setShowSideBar(false);
  }, []);

  return (
    <div id="layout-account">
      <div className="container">
        <Row
          gutter={0}
          wrap={false}
          className={`${showSideBar ? "active-sidebar" : "inactive-sidebar"}`}
        >
          <Col
            className="side-bar relative h-auto xs:w-[0] mlg:w-auto overflow-visible"
            style={{ height: heigthtSidebar }}
          >
            <div
              className="hidden sidebar-mask fixed top-0 left-0 w-[100vw] h-full z-[1]"
              onClick={handleMaskSidebarClick}
            ></div>

            <div className="sticky-sidebar bg-white z-10 pt-4 pb-10 sticky top-[0px] 2lg:w-[262px] w-[227px]">
              <div
                className="btn-toggle-sidebar mlg:hidden"
                onClick={handleToggleSidebar}
              >
                <BiRightArrow className="toggle-arrow" fontSize={20} />
              </div>

              <div className="info-account px-[14px] flex items-center gap-3 cursor-pointer">
                <div className="h-[48px]">
                  <img
                    className="rounded-full"
                    src={infoUser?.avatar ? infoUser.avatar : Images.avatar}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="">
                  <div className="text-xs text-gray-66">
                    {t("myAccount:yourAccount")}
                  </div>
                  <h3 className="w-[120px] font-semibold text-base text-black-33 mb-0 truncate overflow-hidden">
                    {infoUser
                      ? infoUser.name
                        ? infoUser.name
                        : infoUser.nickName
                      : ""}
                  </h3>
                </div>
              </div>
              <Divider
                style={{
                  margin: "16px 0 8px 0",
                }}
              ></Divider>
              {defaultSelectKey && (
                <Menu
                  selectedKeys={[`item-account-${defaultSelectKey}`]}
                  defaultOpenKeys={["sub1"]}
                  mode="inline"
                  theme="light"
                  inlineCollapsed={collapsed}
                >
                  {menuSideBar.map((item) => (
                    <Menu.Item key={`item-account-${item.id}`} icon={item.icon}>
                      <Link href={item.router}>{item.label}</Link>
                    </Menu.Item>
                  ))}
                </Menu>
              )}
            </div>
          </Col>
          <Col ref={refContent} className="content-layout py-6">
            <div className="">{children}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LayoutAccount;
