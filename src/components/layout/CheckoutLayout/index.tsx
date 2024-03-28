import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineRight } from "react-icons/ai";
import Container from "src/components/Container";

type Props = {
  children?: ReactNode;
};

const CheckoutLayout = ({ children }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div id="cart" className="cart-wrapper">
      <Container className="breadcrum-wrapper py-[30px] my-[24px]">
        <ul className="breadcrum-cart-cluster flex justify-center items-center flex-wrap">
          <li className="cart-breadcrum-item">
            <span
              className={`cart-breadcrum-text ${
                router.pathname.split("/").includes("cart")
                  ? "active-cart-breadcrum"
                  : ""
              }`}
              onClick={() => {
                router.push("/cart");
              }}
            >
              {t("cart:shoppingCart")}
            </span>
            <AiOutlineRight className="cart-breadcrum-arrow" fontSize={22} />
          </li>
          <li className="cart-breadcrum-item">
            <span
              className={`cart-breadcrum-text ${
                router.pathname.split("/").includes("checkout")
                  ? "active-cart-breadcrum"
                  : ""
              }`}
              onClick={() => {
                router.push("/cart/checkout");
              }}
            >
              {t("cart:checkout")}
            </span>
            <AiOutlineRight className="cart-breadcrum-arrow" fontSize={22} />
          </li>
          <li className="cart-breadcrum-item">
            <span className="cart-breadcrum-text">
              {t("cart:orderComplete")}
            </span>
          </li>
        </ul>
      </Container>
      {children}
    </div>
  );
};

export default CheckoutLayout;
