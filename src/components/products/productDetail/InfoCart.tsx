import { Divider, Form as AntForm, Modal, Radio } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiShoppingBag } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import { Button, Form, Rating } from "src/components";
import SocialLink from "src/components/auth/SocialLink";
import InputColor from "src/components/InputColor";
import InputProductNumber from "src/components/InputProductNumber";
import LoginModal from "src/components/modal/LoginForm";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import {
  AddItemRequest,
  AddItemResponse,
  GetCartResponse,
} from "src/models/Carts";
import { GetCouponsResponse } from "src/models/Coupon";
import {
  ListAttributeProductResponse,
  ListCountStarRatingResponse,
  ProductDetailResponse,
} from "src/models/Product";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import CouponRepository from "src/repositories/CouponRepository";
import toast from "src/services/toast";

interface InfoCartProps {
  productDetail: ProductDetailResponse;
  ratingProduct?: ListCountStarRatingResponse | null;
  attributeProduct?: ListAttributeProductResponse | null;
}

// type Variant = {
//   productId: number;
//   attributeIds: number[][];
// };

type Variant = {
  productId: number;
  attributeIds: number[];
};

// const description = [
//   "Ultrices eros in cursus turpis massa cursus mattis.",
//   "Volutpat ac tincidunt vitae semper quis lectus.",
//   "Aliquam id diam maecenas ultricies mi eget mauris.",
// ];

const InfoCart = ({
  productDetail,
  ratingProduct,
  attributeProduct,
}: InfoCartProps) => {
  const [form] = AntForm.useForm();
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();

  const [numberProduct, setNumberProduct] = useState<number>(1);
  const [attrDetail, setAttrDetail] = useState<Variant[]>([]);
  const [attrActive, setAttrActive] = useState<number[]>([]);
  const [attrName, setAttrName] = useState<string[]>([]);
  const [cartData, setCartData] = useState<GetCartResponse>();
  const [couponsData, setCouponsData] = useState<GetCouponsResponse>();
  const [showCouponOption, setShowCouponOption] = useState<boolean>(false);
  const [unsave, setUnsave] = useState<number[]>([]);
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { setCart: setCartRedux } = cartModule.actions.creators;

  const {
    name,
    price,
    finalPrice,
    productTmplId,
    isFavourite,
    odooId,
    qtyAvailable,
    productImageOdoo,
  } = productDetail;

  // Call API
  const { run: addItemApi } = useJob((data: AddItemRequest) => {
    return CartRepository.addItemIntoCart(data).pipe(
      map(({ data }: { data: AddItemResponse }) => {
        setCartData(data.userCart);
        const cart: {
          productId: number;
          quantity: number;
          unitPrice: number;
        }[] = [];
        data.userCart.cartItems.map((item) => {
          cart.push({
            productId: item.productId,
            quantity: item.productUomQty,
            unitPrice: item.priceUnit,
          });
        });
        dispatch(setCartRedux(cart));
      }),
      catchError((err) => {
        console.log("add err", err);
        return of(err);
      })
    );
  });

  const { run: getCartApi } = useJob(() => {
    return CartRepository.get().pipe(
      map(({ data }: { data: GetCartResponse }) => {
        if (data) setCartData(data);
      }),
      catchError((err) => {
        console.log("get err", err);
        return of(err);
      })
    );
  });

  const { run: getCouponsApi } = useJob(() => {
    return CouponRepository.getListCoupons().pipe(
      map(({ data }: { data: GetCouponsResponse }) => {
        console.log("get coupon success", data);
        const arr: number[] = [];
        data.data.map((id) => arr.push(Number(id)));
        setCouponsData(data);
        setUnsave(arr);
      }),
      catchError((err) => {
        console.log("get coupon err", err);
        return of(err);
      })
    );
  });

  const { run: saveCouponApi } = useJob((couponId: number) => {
    return CouponRepository.saveCoupon(couponId).pipe(
      map((data) => {
        console.log("save coupon", data.data);
        var arr: number[] = unsave.filter((id) => id !== couponId);
        setUnsave(arr);
      }),
      catchError((err) => {
        console.log("save err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    var attrData: Variant[] = [];
    var attrNameData: string[] = [];
    var active: number[] = [];

    attributeProduct?.productIds.map((prd) => {
      var prdId: number = prd.productId;
      var attrValueId: number[] = [];

      prd.attributes.map((attr) => {
        attrValueId.push(attr.value.id);
        active.push(attr.value.id);
      });

      attrData.push({
        productId: prdId,
        attributeIds: attrValueId,
      });
    });

    attributeProduct?.attributeInfo.map((item) => {
      attrNameData.push(item.name);
    });

    if (session.status === "authenticated") getCartApi();
    getCouponsApi();

    setAttrDetail(attrData);
    setAttrActive(active);
    setAttrName(attrNameData);
    form.resetFields();
  }, [productDetail]);

  // Handle change product number
  const handleChangeNumber = (value: number) => setNumberProduct(value);

  // Handle add item into cart
  const handleAddIntoCart = (value: any) => {
    if (session.status === "authenticated") {
      var flag: boolean = false;
      var variant: number[] = [];

      if (attrName.length > 0) {
        attrName.map((name) => {
          if (value[name]) {
            variant.push(value[name]);
            flag = true;
          } else {
            flag = false;
          }
        });
      } else {
        flag = true;
      }

      if (flag) {
        if (attrDetail.length > 0) {
          attrDetail.map((attr) => {
            if (
              attr.attributeIds.every((item, index) => item === variant[index])
            ) {
              cartData?.cartItems.forEach((item) => {
                if (item.productId === attr.productId) {
                  value.productNumber += item.productUomQty;
                }
              });

              addItemApi({
                name: name,
                priceUnit: finalPrice > 0 ? finalPrice : price,
                productId: attr.productId,
                productTemplateId: productTmplId,
                productUomQty: value.productNumber,
                image: productImageOdoo[0]
                  ? "data:image/png;base64," + productImageOdoo[0].image
                  : Images.product.noProductImg,

                // qtyAvailable: qtyAvailable,
              });
              toast.show("success", t("products:addItemSuccess"));
            }
          });
        } else {
          cartData?.cartItems.forEach((item) => {
            if (item.productId === Number(odooId)) {
              value.productNumber += item.productUomQty;
            }
          });
          addItemApi({
            name: name,
            priceUnit: finalPrice > 0 ? finalPrice : price,
            productId: Number(odooId),
            productTemplateId: productTmplId,
            productUomQty: value.productNumber,
            image: productImageOdoo[0]
              ? "data:image/png;base64," + productImageOdoo[0].image
              : Images.product.noProductImg,
            // qtyAvailable: qtyAvailable,
          });

          toast.show("success", t("products:addItemSuccess"));
        }
      } else {
        toast.show("error", t("products:notSelected"));
      }
      form.resetFields();
    } else {
      router.push({
        pathname: "/auth/login",
      });
      // setModalAuth(true);
    }
  };

  // const brandIds: number[] = [];
  const handleChooseAttr = (data: any) => {
    const newData = typeof data === "number" ? data : data.target.value;
    const attrActiveData: number[] = [];
    attrDetail.map((attr) => {
      if (attr.attributeIds.includes(newData)) {
        attr.attributeIds.map((item) => attrActiveData.push(item));
      }
    });
    setAttrActive(attrActiveData);
  };

  const handleSaveCoupon = (couponId: number) => {
    if (session.status === "authenticated") {
      saveCouponApi(couponId);
      getCartApi();
    } else {
      router.push({
        pathname: "/auth/login",
      });
    }
  };

  // useEffect(() => {
  //   var attrData: Variant[] = [];
  //   var active: number[] = [];
  //   attributeProduct?.productIds.map((prd) => {
  //     var prdId: number = prd.productId;
  //     var attrValueId: number[][] = [];

  //     prd.attributes.map((attr) => {
  //       attrValueId.push([attr.attributeId, attr.value.id]);
  //       active.push(attr.value.id);
  //     });

  //     attrData.push({
  //       productId: prdId,
  //       attributeIds: attrValueId,
  //     });
  //   });
  //   setAttrDetail(attrData);
  //   setAttrActive(active);
  // }, []);

  const renderActive = (attrValueId: number) => {
    var flag: boolean = false;
    attrActive.map((item) => {
      if (item === attrValueId) {
        flag = true;
      }
    });
    return flag;
  };

  const renderAttributeSelect = useMemo(() => {
    return attributeProduct?.attributeInfo.map((item) => {
      if (item.displayType === "color") {
        return (
          <div className="mb-4 flex items-center">
            <div className="flex w-[100px]">{t("filters:color")} : </div>
            <Form.Item className="mb-0" name={item.name}>
              <InputColor
                attrActive={attrActive}
                attrId={item.attributeId}
                colorData={item.value}
                value={item.value[0].id}
                onChange={handleChooseAttr}
              />
            </Form.Item>
          </div>
        );
      }

      if (item.displayType === "radio") {
        return (
          <div className="mb-4 flex items-center">
            <div className="flex w-[100px]">{t(`filters:${item.name}`)} : </div>
            <Form.Item className="mb-0" name={item.name}>
              <Radio.Group
                style={{ width: "calc(100% - 100px)" }}
                buttonStyle="solid"
                onChange={handleChooseAttr}
              >
                {item.value.map((val) => (
                  <Radio.Button
                    className={
                      renderActive(val.id) ? "" : "opacity-50 not-allowed"
                    }
                    value={val.id}
                  >
                    {val.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        );
      }
    });
  }, [attrActive]);

  // const renderAttributeSelect = useMemo(() => {
  //   return attributeProduct?.attributeInfo.map((item) => {
  //     if (item.displayType === "color") {
  //       return (
  //         <div className="mb-4 flex items-center">
  //           <div className="flex w-[100px]">{t("filters:color")} : </div>
  //           <Form.Item className="mb-0" name={item.name}>
  //             <InputColor
  //               attrActive={attrActive}
  //               attrId={item.attributeId}
  //               colorData={item.value}
  //               // value={item.value[0].id}
  //               onChange={handleChooseAttr}
  //             />
  //           </Form.Item>
  //         </div>
  //       );
  //     }

  //     if (item.displayType === "radio") {
  //       return (
  //         <div className="mb-4 flex items-center">
  //           <div className="flex w-[100px]">{t(`filters:${item.name}`)} : </div>
  //           <Form.Item className="mb-0" name={item.name}>
  //             <Radio.Group
  //               style={{ width: "calc(100% - 100px)" }}
  //               buttonStyle="solid"
  //               onChange={handleChooseAttr}
  //             >
  //               {item.value.map((val) => (
  //                 <Radio.Button
  //                   className={
  //                     renderActive(val.id) ? "" : "opacity-50 not-allowed"
  //                   }
  //                   value={`${item.attributeId}-${val.id}`}
  //                 >
  //                   {val.name}
  //                 </Radio.Button>
  //               ))}
  //             </Radio.Group>
  //           </Form.Item>
  //         </div>
  //       );
  //     }
  //   });
  // }, [attrActive]);

  const getExpiredDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " - " + mm + " - " + yyyy;
  };

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div id="info-cart">
        <h4 className="xs:text-[1.25rem] md:text-2xl font-semibold">{name}</h4>
        {/* <div className="flex items-center gap-3">
        <div className="border-[1px] border-gray-ee border-solid">
          <Image src={Images.partner.skySuite} width={102} height={48} alt="" />
        </div>
        <div className="flex-grow flex justify-center flex-col">
          <div className="mb-1 text-[13px]">
            Category: <span className="text-gray-66">{category}</span>
          </div>
          <div className="text-[13px]">
            SKU: <span className="text-gray-66">MS468194</span>
          </div>
        </div>
      </div> */}
        <Divider></Divider>
        <h4 className="text-3xl font-bold mb-2">
          {finalPrice > 0 ? (
            <div>
              {t("utilities:currency", { val: finalPrice })}
              <span className="text-gray-aa line-through ml-4 font-semibold text-2xl">
                {t("utilities:currency", { val: price })}
              </span>
              {qtyAvailable === 0 ? (
                <span className="ml-2 text-base font-semibold">
                  ({t("products:productOutOfStock")})
                </span>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div>
              {t("utilities:currency", {
                val: price,
              })}
            </div>
          )}
        </h4>
        {ratingProduct ? (
          <Rating
            className="mb-2"
            allowHalf
            defaultValue={Number(ratingProduct[0]?.average.toFixed(2))}
            disabled
            count={5}
            reviews={ratingProduct[0]?.total}
          />
        ) : (
          <Rating
            className="mb-2"
            allowHalf
            defaultValue={0}
            disabled
            count={5}
            reviews={0}
          />
        )}
        {/* <div
          className="description"
          dangerouslySetInnerHTML={{ __html: description }}
        >
          {description.map((des) => (
          <div className="flex mb-2" key={des}>
            <span className="mr-1">
              <FcCheckmark />
            </span>
            <span className="text-gray-66">{des}</span>
            </div>
        ))}
        </div> */}
        {attributeProduct && attributeProduct.attributeInfo.length > 0 ? (
          <Divider />
        ) : (
          ""
        )}
        <Form className="info-order" form={form} onFinish={handleAddIntoCart}>
          {renderAttributeSelect}
          <Divider />

          {/* Choose coupon */}
          {couponsData && couponsData.data.length > 0 ? (
            <div className="mb-4">
              <p className="font-semibold">
                {couponsData.total} {t("products:coupon")}
              </p>
              <div
                className="flex items-center gap-3"
                onClick={() => setShowCouponOption(true)}
              >
                {couponsData.data.map((coupon, index) => {
                  if (index <= 1) {
                    return (
                      <div className="flex gap-4 text-xs font-semibold">
                        <div className="relative px-4 rounded border border-[#0d5cb6] text-[#0d5cb6] cursor-pointer">
                          {/* circle left */}
                          <div className="absolute inset-y-[2px] left-[-7px] w-3 h-3 bg-white rounded-full border border-l-white border-b-white border-t-[#0d5cb6] border-r-[#0d5cb6] origin-center rotate-45 translate-y-2/4"></div>
                          {/* circle right */}
                          <div className="absolute inset-y-[2px] right-[-7px] w-3 h-3 bg-white rounded-full border border-r-white border-t-white border-l-[#0d5cb6] border-b-[#0d5cb6] origin-center rotate-45 translate-y-2/4"></div>
                          {/* text coupon */}
                          <p className="my-[6px]">
                            {/* {t("products:decrease")}  */}
                            {coupon.name}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}

                {couponsData.data.length > 1 ? (
                  <span className="cursor-pointer font-medium">
                    <FaChevronRight size={18} color="#0d5cb6" />
                  </span>
                ) : (
                  ""
                )}
              </div>
              <Modal
                className="modalCoupon"
                visible={showCouponOption}
                title={
                  <p className="mt-2 mb-1 text-center text-[20px] font-semibold">
                    {t("products:coupon")}
                  </p>
                }
                onCancel={() => setShowCouponOption(false)}
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
                <Form.Item>
                  <div className="flex flex-col gap-4">
                    {couponsData.data.map((coupon) => (
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
                            {/* <div className="cursor-pointer relative coupon__dropdown mt-1">
                              <AiOutlineInfoCircle
                                style={{
                                  fontSize: "1.125rem",
                                  color: "#336699",
                                }}
                              />
                            </div> */}
                            <div className="coupon__expiry mb-[6px] w-full flex items-end justify-between text-xs text-slate-400">
                              <div>
                                HSD: {getExpiredDate(coupon.expiredDate)}
                              </div>
                              {coupon.isSave ? (
                                <Image
                                  src={Images.icons.isSaved}
                                  width={60}
                                  height={60}
                                />
                              ) : (
                                <div
                                  className="py-[4px] px-[14px] border rounded-md bg-[#017fff] text-sm text-white font-semibold cursor-pointer hover:opacity-80"
                                  onClick={() => handleSaveCoupon(coupon.id)}
                                >
                                  {t("products:saveCoupon")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Modal>
            </div>
          ) : (
            ""
          )}
          <div className="flex xs:flex-col 2xs:flex-row">
            <div>
              <Form.Item name="productNumber">
                <InputProductNumber
                  value={numberProduct}
                  onChange={handleChangeNumber}
                />
              </Form.Item>
            </div>
            <div className="2xs:flex-1 xs:w-full 2xs:w-[unset] 2xs:ml-2 xs:mt-2 2xs:mt-0">
              <Form.Item>
                <Button
                  className={`add-to-cart uppercase ${
                    qtyAvailable > 0 ? "can-buy" : ""
                  }`}
                  htmlType="submit"
                  disabled={qtyAvailable === 0 ? true : false}
                >
                  <BiShoppingBag className="text-[18px] mr-2" />
                  {t("common:addToCart")}
                </Button>
              </Form.Item>
            </div>
          </div>
          <SocialLink productId={productTmplId} isFavourite={isFavourite} />
        </Form>
      </div>
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
    </>
  );
};

export default InfoCart;
