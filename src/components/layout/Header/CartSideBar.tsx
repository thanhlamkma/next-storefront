import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import { useJob } from "src/core/hooks";
import {
  GetCartResponse,
} from "src/models/Carts";
import CartRepository from "src/repositories/CartRepository";

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartSideBar = ({ show, setShow }: Props) => {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation();
  const [cartData, setCartData] = useState<GetCartResponse>();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Call API
  const { run: getCartApi } = useJob(() => {
    return CartRepository.get().pipe(
      map(({ data }: { data: GetCartResponse }) => {
        if (data) setDetailCart(data);
        else setCartData(undefined);
      }),
      catchError((err) => {
        console.log("get err", err);
        return of(err);
      })
    );
  });

  // const { run: removeItemApi } = useJob((id: number[]) => {
  //   return CartRepository.removeItemFromCart({ productIds: id }).pipe(
  //     map(({ data }: { data: AddItemResponse }) => {
  //       setCart(data.userCart);
  //     }),
  //     catchError((err) => {
  //       console.log("clear err", err);
  //       return of(err);
  //     })
  //   );
  // });

  useEffect(() => {
    if (session.status === "authenticated") getCartApi();
  }, [show]);

  // Set cart
  const setDetailCart = (data: GetCartResponse) => {
    if (data) {
      setCartData(data);
      var total: number = 0;
      data.cartItems.map((prd) => {
        total += prd.priceUnit * prd.productUomQty;
      });
      setTotalPrice(total);
    }
  };

  // Handle remove item from cart
  // const handleRemove = (id: number) => {
  //   removeItemApi([id]);
  // };

  return (
    <div
      className={`cart-side-bar-wrapper ${
        show ? "show-cart-side-bar" : ""
      } w-[100%] h-[100vh] fixed z-[1] top-0 left-0`}
    >
      <div
        className="cart-side-bar-mask z-[-1] absolute top-0 left-0 w-[100%] h-[100%] bg-[#222] opacity-50"
        onClick={() => setShow(false)}
      ></div>
      <div className="cart-side-bar xs:max-w-[380px] sm:w-[460px] h-[100vh] bg-white p-[30px] absolute top-0 right-0">
        <div className="cart-side-bar-title flex justify-between items-end mb-[14px]">
          <span className="uppercase font-bold text-[16px]">
            {t("cart:shoppingCart")}
          </span>
          <span
            className="close-text text-[#666] text-[14.8px] flex items-center"
            onClick={() => setShow(false)}
          >
            {t("cart:close")}{" "}
            <BsArrowRight className="ml-[5px]" fontSize={20} />
          </span>
        </div>
        {cartData && cartData.cartItems.length > 0 ? (
          <>
            <div className="cart-side-bar-content pb-[12px]">
              {cartData.cartItems.map((item) => (
                <div className="cart-product flex pt-[20px]">
                  <div className="product-info flex flex-col justify-center flex-1 pr-[10%]">
                    <div className="product-name mb-[10px] font-medium">
                      {item.name}
                    </div>
                    <div className="product-quantity-and-price text-[15.5px]">
                      <span className="text-[#999] font-medium">
                        {item.productUomQty}
                      </span>
                      <span>&nbsp;&nbsp;x&nbsp;&nbsp;</span>
                      <span className="font-semibold text-hover-color">
                        {t("utilities:currency", { val: item.priceUnit })}
                      </span>
                    </div>
                  </div>
                  <div className="product-photos relative">
                    <Image
                      src={
                        item.image ? item.image : Images.product.noProductImg
                      }
                      width={90}
                      height={90}
                      objectFit="contain"
                    />
                    {/* <XIcon onClick={() => handleRemove(item.productId)} /> */}
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-side-bar-footer font-semibold">
              <div className="cart-side-bar-total py-[18px] flex justify-between font-semibold">
                <span className="text-[14px]">{t("cart:subtotal")}: </span>
                <span className="sm:text-[16px] text-sm">
                  {t("utilities:currency", { val: totalPrice })}
                </span>
              </div>
              <div className="cart-side-bar-btn flex sm:text-sm text-xs">
                <button
                  className="cart-btn view-cart-btn"
                  onClick={() => {
                    setShow(false);
                    router.push("/cart");
                  }}
                >
                  {t("cart:viewCart")}
                </button>
                <button
                  className="cart-btn checkout-btn"
                  onClick={() => {
                    setShow(false);
                    router.push("/cart/checkout");
                  }}
                >
                  {t("cart:checkout")}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="m-10 flex flex-col items-center justify-center">
            <Image
              className="opacity-40"
              src={Images.cart.noProduct}
              width={100}
              height={100}
            />
            <span className="mt-3 text-sm text-gray-400">
              {t("cart:noProduct")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSideBar;
