import { Col, Row } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
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
  AddItemRequest,
  AddItemResponse,
  CartItemResponse,
  GetCartResponse,
} from "src/models/Carts";
import { DetailStateResponse } from "src/models/Common";
import {
  CreateRequest as CreateAddressRequest,
  GetDetailAddressResponse,
  UpdateRequest as UpdateRequestAddress,
} from "src/models/Partner";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import CommonRepository from "src/repositories/CommonRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import toast from "src/services/toast";

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

        if (addressData.stateId) {
          const { data: detailState } = await lastValueFrom(
            CommonRepository.getDetailState(addressData.stateId)
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

type ProductCartProps = {
  // item: CartProductDataType;
  item: CartItemResponse;
  onRemove: (id: number) => void;
  onUpdate: (data: AddItemRequest) => void;
};

const ProductCart: React.FC<ProductCartProps> = ({
  item,
  onRemove,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(item.productUomQty);

  const handleRemoveProduct = (id: number) => {
    onRemove(id);
  };

  const handleChangeNumber = (data: AddItemRequest) => {
    onUpdate(data);
  };

  return (
    <Row
      gutter={{
        xs: 0,
        md: 10,
      }}
      className="cart-product py-[20px]"
    >
      <Col
        xs={{
          span: 24,
        }}
        md={10}
        className="product-img-name flex md:flex-row xs:items-center xs:flex-col"
      >
        <div className="cart-product-img-wrapper relative xs:max-w-[80%] md:max-w-[100px]">
          <Image
            src={item.image ? item.image : Images.product.noProductImg}
            width={300}
            height={300}
            objectFit="contain"
          />
          <XIcon onClick={() => handleRemoveProduct(item.productId)} />
        </div>
        <span className="cart-product-name flex-1 xs:mb-[10px] md:mx-0 pl-[20px] font-medium">
          {item.name}
        </span>
      </Col>
      <Col
        md={4}
        xs={{
          span: 24,
        }}
        className="product-price flex xs:mb-[10px] md:mx-0 xs:justify-center md:justify-start items-center text-[16px] text-[#666] "
      >
        {t("utilities:currency", { val: item.priceUnit })}
      </Col>
      <Col
        md={5}
        xs={{
          span: 24,
        }}
        className="product-quantity xs:mb-[10px] md:mx-0 flex items-center justify-center"
      >
        <div className="change-quantity-group">
          <input
            className="quantity w-[30px] focus:outline-none pl-[6px]"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) as number)}
            onKeyPressCapture={() =>
              handleChangeNumber({
                name: item.name,
                priceUnit: item.priceUnit,
                productId: item.productId,
                productTemplateId: item.productTemplateId,
                productUomQty: quantity,
                image: item.image,
              })
            }
          />
          <button
            onClick={() => {
              if (quantity > 1) {
                handleChangeNumber({
                  name: item.name,
                  priceUnit: item.priceUnit,
                  productId: item.productId,
                  productTemplateId: item.productTemplateId,
                  productUomQty: quantity - 1,
                  image: item.image,
                });
                setQuantity(quantity - 1);
              } else {
                handleRemoveProduct(item.productId);
              }
            }}
            className="change-quantity"
          >
            -
          </button>
          <button
            onClick={() => {
              handleChangeNumber({
                name: item.name,
                priceUnit: item.priceUnit,
                productId: item.productId,
                productTemplateId: item.productTemplateId,
                productUomQty: quantity + 1,
                image: item.image,
              });
              setQuantity(quantity + 1);
            }}
            className="change-quantity"
          >
            +
          </button>
        </div>
      </Col>
      <Col
        md={5}
        xs={{
          span: 24,
        }}
        className="product-subtotal flex xs:justify-center md:justify-end items-center text-[16px] font-semibold"
      >
        {t("utilities:currency", { val: item.priceUnit * quantity })}
      </Col>
    </Row>
  );
};

const Cart = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [cartData, setCartData] = useState<GetCartResponse | null>(
    props.cartData
  );
  const [addressData, setAddressData] =
    useState<GetDetailAddressResponse | null>(props.addressData);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const dispatch = useDispatch();
  const { setCart: setCartRedux } = cartModule.actions.creators;

  // Call API
  const { run: addItemApi } = useJob((data: AddItemRequest) => {
    return CartRepository.addItemIntoCart(data).pipe(
      map(({ data }: { data: AddItemResponse }) => {
        setDetailCart(data.userCart);
      }),
      catchError((err) => {
        console.log("add err", err);
        return of(err);
      })
    );
  });

  const { run: removeProductApi } = useJob((id: number[]) => {
    return CartRepository.removeItemFromCart({ productIds: id }).pipe(
      map(({ data }: { data: AddItemResponse }) => {
        setDetailCart(data.userCart);
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
        console.log("clear err", err);
        return of(err);
      })
    );
  });

  // const { run: getAddressDefaultApi } = useJob((id: number) => {
  //   return PartnerRepository.getDetailAddress(id).pipe(
  //     map(({ data }: { data: GetDetailAddressResponse }) => {
  //       setAddressData(data);
  //     }),
  //     catchError((err) => {
  //       console.log("get addr err", err);
  //       return of(err);
  //     })
  //   );
  // });

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

  useEffect(() => {
    if (cartData) setDetailCart(cartData);
  }, []);

  // Set cart
  const setDetailCart = (data: GetCartResponse) => {
    var total: number = 0;
    setCartData(data);
    data.cartItems.map((prd) => {
      total += prd.priceUnit * prd.productUomQty;
    });
    setTotalPrice(total);
  };

  // Handle remove item
  const handleRemove = (id: number) => {
    removeProductApi([id]);
  };

  // Handle remove all item
  const handleRemoveAll = () => {
    var productIds: number[] = [];
    cartData &&
      cartData.cartItems.map((item) => productIds.push(item.productId));
    removeProductApi(productIds);
  };

  // Handle update product number
  const handleUpdate = (data: AddItemRequest) => {
    addItemApi(data);
  };

  // Handle submit address
  const handleSubmitAddress = (data: CreateAddressRequest) => {
    console.log("address req", data);
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

  return cartData && cartData.cartItems.length > 0 ? (
    <>
      <Head>
        <title>{t("cart:shoppingCart")}</title>
      </Head>
      <Container className="mb-[20px] pb-[20px]">
        {/* Danh sách sản phẩm */}
        <Row className="w-[100%]">
          <Col
            xs={24}
            lg={16}
            className="cart-products-side xs:pr-0 mlg:pr-[36px]"
          >
            <div className="cart-products-wrapper w-[100%]">
              <Row
                gutter={{
                  xs: 0,
                  md: 10,
                }}
                className="cart-list-products-title md:flex xs:hidden"
              >
                <Col xs={24} md={10} className="img-name-title product-title">
                  {t("common:product")}
                </Col>
                <Col md={4} xs={24} className="price-title product-title">
                  {t("common:price")}
                </Col>
                <Col
                  md={5}
                  xs={{
                    span: 24,
                  }}
                  className="quantity-title product-title text-center"
                >
                  {t("common:quantity")}
                </Col>
                <Col
                  md={5}
                  xs={{
                    span: 24,
                  }}
                  className="subtotal-title product-title text-right"
                >
                  {t("cart:subtotal")}
                </Col>
              </Row>
              {cartData.cartItems.map((product) => {
                return (
                  <ProductCart
                    key={`product-${product.productId}`}
                    item={product}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                  />
                );
              })}
            </div>

            <div className="cart-action flex py-[20px] flex-wrap mb-[30px]">
              <div
                className="left-cart-action flex items-center continue-shoping-btn px-[28px] py-[13px] text-[#fff] bg-[#333] font-medium rounded-[3px] mr-auto hover:opacity-90"
                onClick={() => router.push("/")}
              >
                <BiArrowBack className="mr-[6px]" fontSize={20} />
                <span className="uppercase text-[14.8px] leading-[16px]">
                  {t("cart:continueShoping")}
                </span>
              </div>
              <div
                className="right-cart-action clear-cart-btn bg-white border-border-color cursor-pointer hover:bg-[#e1e1e1] hover:border-[#e1e1e1]"
                onClick={handleRemoveAll}
              >
                {t("cart:clearCart")}
              </div>
            </div>
            {/* <div className="discount-wrapper w-[100%]">
              <h1 className="uppercase text-[16px] font-semibold mb-[20px]">
                {t("cart:couponDiscount")}
              </h1>
              <input
                placeholder="Enter coupon code here"
                className="coupon-discount-input"
                type="text"
              />
              <div className="apply-coupon-btn uppercase">
                {t("cart:applyCoupon")}
              </div>
            </div> */}
          </Col>
          <Col xs={24} lg={8} className="cart-shipping-info-side-wrapper">
            <div className="cart-shipping-info-side w-[100%] px-[30px] pt-[23px] pb-[40px]">
              <h1 className="cart-total-text uppercase text-[20px] font-bold pb-[21px]">
                {t("cart:cartTotals")}
              </h1>
              <div className="sub-total flex justify-between font-semibold text-[16px] pb-[16px] border-b-[1px] border-b-solid border-b-border-color">
                <span>{t("cart:subtotal")}</span>
                <span>{t("utilities:currency", { val: totalPrice })}</span>
              </div>
              <div className="shipping-info mt-[24px]">
                <h1 className="font-semibold text-[16px] mb-[16px]">
                  {t("cart:shipping")}
                </h1>
                <p className="text-[15px] text-[#666] mb-[12px] flex justify-between">
                  <span> {t("cart:shippingTo")}</span>
                  <span
                    className="cursor-pointer font-medium"
                    onClick={() => setOnEdit(true)}
                  >
                    {t("common:edit")}
                  </span>
                </p>

                {addressData ? (
                  <>
                    <p className="text-[15px] text-[#333] font-semibold mb-[4px] flex justify-between">
                      <span>{addressData?.name}</span>
                      <span className="flex-1 ml-[24px]">
                        {addressData?.phone}
                      </span>
                    </p>

                    <p className="customer-address text-[13.5px] text-[#666] mb-[4px]">
                      {addressData?.street},&nbsp;{addressData?.street2}
                    </p>
                  </>
                ) : (
                  ""
                )}

                {/* <div className="total-price flex justify-between font-semibold text-[16px] py-[25px]">
                  <span>{t("cart:total")}</span>
                  <span>$100.00</span>
                </div> */}
                <div
                  className="proceed-to-checkout-btn cursor-pointer flex items-center justify-center mt-8 py-[14px] text-[white] bg-[#ff424e] rounded-[3px] hover:opacity-90"
                  onClick={() => router.push("/cart/checkout")}
                >
                  <span className="uppercase text-[14px] leading-[16px] font-semibold">
                    {t("cart:proceedToCheckout")}
                  </span>
                  <HiArrowNarrowRight className="ml-[6px]" fontSize={20} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <AddressModal
        className="customer-infor-modal"
        onSubmitAddress={handleSubmitAddress}
        detailAddess={addressData}
        detailState={props.detailState}
        title={
          <p className="text-center text-[16px] font-semibold">
            {t("cart:customerInfomation")}
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
  ) : (
    <Container className="mb-[20px] pb-[20px]">
      <Head>
        <title>{t("cart:shoppingCart")}</title>
      </Head>
      <div className="mb-10 p-10 flex flex-col items-center justify-center rounded-md bg-gray-100">
        <Image
          className="opacity-40"
          src={Images.cart.noProduct}
          width={180}
          height={180}
        />
        <span className="m-3 text-base text-gray-400">
          {t("cart:noProduct")}
        </span>
        <div
          className="left-cart-action flex items-center continue-shoping-btn mt-5 px-[28px] py-[13px] text-[#fff] bg-[#333] font-medium rounded-[3px] hover:opacity-90"
          onClick={() => router.push("/")}
        >
          <BiArrowBack className="mr-[6px]" fontSize={20} />
          <span className="uppercase text-[14.8px] leading-[16px]">
            {t("cart:continueShoping")}
          </span>
        </div>
      </div>
    </Container>
  );
};

Cart.getLayout = (page: any) => {
  return (
    <Layout>
      <CheckoutLayout>{page}</CheckoutLayout>
    </Layout>
  );
};

export default Cart;
