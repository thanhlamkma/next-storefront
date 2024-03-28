import { Button, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TiArrowBack } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import Layout from "src/components/layout";
import { CartProductDataType } from "src/components/layout/Header/ThirdRow/mockData";
import LayoutAccount from "src/components/layout/LayoutAccount";
import CommentProduct from "src/components/modal/CommentProduct";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import {
  Notification,
  notifications as notificationsData,
} from "src/data/notifications";
import { AddItemRequest, AddItemResponse } from "src/models/Carts";
import { GetDetailOrderResponse } from "src/models/Order";
import { GetDetailAddressResponse } from "src/models/Partner";
import {
  GetImagesByProductTmpRequest,
  GetImagesByProductTmpResponse,
  ListProductByIdResquest,
  ProductDetailResponse,
} from "src/models/Product";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import OrderRepository from "src/repositories/OrderRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import ProductRepository from "src/repositories/ProductRepository";
import toast from "src/services/toast";

interface OrderDetailProps {
  detailOrderData: GetDetailOrderResponse;
  shippingAddressData: GetDetailAddressResponse;
}

type NotificationProps = {
  item: Notification;
};

type ImageProduct = {
  id: number;
  image: string;
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    try {
      const { data: detailOrderData } = await lastValueFrom(
        OrderRepository.getOne(Number(context.params?.id))
      );

      const { data: shippingAddressData } = await lastValueFrom(
        PartnerRepository.getDetailAddress(detailOrderData.partnerShippingId)
      );

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          detailOrderData,
          shippingAddressData,
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

const NotificationItem: React.FC<NotificationProps> = ({ item }) => {
  return (
    <div id="notificationItem" className="my-4">
      <Row gutter={10}>
        <Col xs={24} md={3}>
          <div className="flex items-center h-full">
            <span className="text-[13px] text-gray-66 pl-2">{item.time}</span>
          </div>
        </Col>
        <Col xs={24} md={21}>
          <p className="text-[13px] text-gray-66 text-justify xs:pl-2 md:pl-0 pr-2">
            {item.content}
          </p>
        </Col>
      </Row>
    </div>
  );
};

const OrderDetail: PageComponent<OrderDetailProps> = ({
  detailOrderData,
  shippingAddressData,
}) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState<boolean>(false);
  // const [product, setProduct] = useState<Array<CartProductDataType> | []>(
  //   cartProductData
  // );
  const [products, setProducts] = useState<Array<CartProductDataType>>();
  const [notifications, setNotifications] = useState<Array<Notification> | []>(
    notificationsData
  );

  const dispatch = useDispatch();
  const { setCart: setCartRedux } = cartModule.actions.creators;

  console.log("orderData", detailOrderData);

  // Call API
  const { run: getImagesApi } = useJob((data: ListProductByIdResquest) => {
    return ProductRepository.getListProductByIds(data).pipe(
      map(({ data }: { data: ProductDetailResponse[] }) => {
        const imgData: ImageProduct[] = [];
        data.map((item) => {
          imgData.push({
            id: item.productTmplId,
            image: item.productImageOdoo[0]
              ? "data:image/png;base64," + item.productImageOdoo[0].image
              : Images.product.noProductImg,
          });
        });
        setProducts(() => {
          const prd: CartProductDataType[] = [];
          detailOrderData.orderLines.map((item) =>
            prd.push({
              productId: item.productId,
              name: item.name,
              price: item.priceUnit,
              quantity: item.productUomQty,
              sale: 0,
              status: item.state,
              total: item.priceSubTotal,
              img: getImg(item.productTemplateId, imgData),
              productTemplateId: item.productTemplateId,
            })
          );
          return prd;
        });
      }),
      catchError((err) => {
        console.log("get image err", err);
        return of(err);
      })
    );
  });

  const { run: getImagesProductApi } = useJob(
    (data: GetImagesByProductTmpRequest) => {
      return ProductRepository.getImagesByProductTmpId(data).pipe(
        map(({ data }: { data: GetImagesByProductTmpResponse[] }) => {
          console.log("get img success", data);
          const imgData: ImageProduct[] = [];
          data.map((item) => {
            imgData.push({
              id: item.productTmplId,
              image: item.productImageOdoo[0]
                ? "data:image/png;base64," + item.productImageOdoo[0].image
                : Images.product.noProductImg,
            });
          });
          setProducts(() => {
            const prd: CartProductDataType[] = [];
            detailOrderData.orderLines.map((item) =>
              prd.push({
                productId: item.productId,
                name: item.name,
                price: item.priceUnit,
                quantity: item.productUomQty,
                sale: 0,
                status: item.state,
                total: item.priceSubTotal,
                img: getImg(item.productTemplateId, imgData),
                productTemplateId: item.productTemplateId,
              })
            );
            return prd;
          });
        }),
        catchError((err) => {
          console.log("get img err", err);
          return of(err);
        })
      );
    }
  );

  const { run: addItemApi } = useJob((data: AddItemRequest) => {
    return CartRepository.addItemIntoCart(data).pipe(
      map(({ data }: { data: AddItemResponse }) => {
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
        toast.show("success", t("products:addItemSuccess"));
      }),
      catchError((err) => {
        console.log("add err", err);
        toast.show("error", t("products:errProduct"));
        return of(err);
      })
    );
  });

  // Get image product
  const getImg = (id: number, imagesData: ImageProduct[]) => {
    const img: ImageProduct[] = imagesData.filter((img) => img.id === id);
    return img[0] ? img[0].image : Images.product.noProductImg;
  };

  useEffect(() => {
    const idArr: number[] = [];
    if (detailOrderData) {
      detailOrderData.orderLines.map((item) => {
        if (!idArr.includes(item.productTemplateId))
          idArr.push(item.productTemplateId);
      });
    }
    console.log("idArr", idArr);
    // getImagesApi({ productTmplId: idArr });
    getImagesProductApi({ productTmplId: idArr });
  }, []);

  const handleRepurchase = useCallback((data: AddItemRequest) => {
    addItemApi(data);
  }, []);

  const columns: ColumnsType<CartProductDataType> =
    useMemo((): ColumnsType<CartProductDataType> => {
      return [
        {
          title: `${t("orderManagement:product")}`,
          dataIndex: "img",
          render: (val: any, item: CartProductDataType) => (
            <div className="flex items-start">
              <Image
                width={80}
                height={80}
                objectFit="contain"
                src={`${item.img}`}
              />
              <div className="productInOrder-info ml-5 pt-2 mb-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-[11px] my-2">
                  {t("orderManagement:provideBy")}{" "}
                  <span className="productInOrder-info__store">
                    Tii24h.com
                  </span>
                </div>
                {item.status === "delivered" ? (
                  <Button
                    className="account__btn mt-2 mr-3 px-5 h-[32px] rounded-[3px] text-xs"
                    onClick={() => setComment(true)}
                  >
                    {t("common:writeReview")}
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  className="account__btn mt-2 px-5 h-[32px] rounded-[3px] text-xs"
                  onClick={() =>
                    handleRepurchase({
                      name: item.name,
                      priceUnit: item.price,
                      productId: item.productId,
                      productTemplateId: item.productTemplateId,
                      productUomQty: item.quantity,
                      image: item.img,
                    })
                  }
                >
                  {t("orderManagement:repurchase")}
                </Button>
              </div>
            </div>
          ),
        },
        {
          title: `${t("orderManagement:price")}`,
          dataIndex: "price",
          render: (val: number, item: CartProductDataType) => (
            <div className="mt-2 text-[13px]">
              {t("utilities:currency", {
                val: item.price,
              })}
            </div>
          ),
        },
        {
          title: `${t("orderManagement:quantity")}`,
          dataIndex: "quantity",
          align: "center",
          render: (val: number, item: CartProductDataType) => (
            <div className="mt-2 text-[13px]">{item.quantity}</div>
          ),
        },
        {
          title: `${t("orderManagement:discount")}`,
          dataIndex: "sale",
          render: (val: number, item: CartProductDataType) => (
            <div className="mt-2 text-[13px]">
              {t("utilities:currency", {
                val: item.sale,
              })}
            </div>
          ),
        },
        {
          title: `${t("orderManagement:subTotal")}`,
          dataIndex: "total",
          align: "right",
          render: (val: number, item: CartProductDataType) => (
            <div className="mt-2 pr-2 text-[13px]">
              {t("utilities:currency", {
                val: item.total,
              })}
            </div>
          ),
        },
      ];
    }, [setComment, t]);

  const getExpiredDate = (time: string) => {
    const date = new Date(time);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return dd + " / " + mm + " / " + yyyy;
  };

  return (
    <div id="order-detail">
      <div className="order-detail__title text-base relative">
        <span className="relative pr-4">
          {t("order:orderDetails")} #{detailOrderData.id} -
          <strong className="font-medium ml-1">
            {t("orderManagement:waitProcess")}
          </strong>
        </span>
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="account__title text-sm uppercase">
          {t("common:notification")}
        </div>
        <div className="account__title text-sm">
          {t("order:orderDate")}: {getExpiredDate(detailOrderData.orderDate)}
        </div>
      </div>
      <div className="border rounded-[3px] px-3 mt-3">
        {notifications && notifications.length < 0 ? (
          notifications.map((noti) => (
            <NotificationItem key={`product-${noti.time}`} item={noti} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center py-6">
            <div className="mb-2 text-xl font-medium text-gray-400">
              {t("order:notHaveNotifications")}
            </div>
            {/* <Button>{t("common:continueShopping")}</Button> */}
          </div>
        )}
      </div>
      <Row gutter={16} className="mt-5">
        <Col span={8}>
          <div className="account__title text-sm">
            {t("order:receiverAddress")}
          </div>
          {shippingAddressData ? (
            <div className="order-detail__box border rounded-[3px] p-3 mt-2">
              <div className="order-detail__user-name mb-2">
                {shippingAddressData.name}
              </div>
              <div className="order-detail__description mb-1">
                {shippingAddressData.street},&nbsp;{shippingAddressData.street2}
              </div>
              <div className="order-detail__description">
                {t("accountAddress:phone")}: {shippingAddressData.phone}
              </div>
            </div>
          ) : (
            ""
          )}
        </Col>
        <Col span={8}>
          <div className="account__title text-sm">
            {t("order:deliveryMethod")}
          </div>
          <div className="order-detail__box border rounded-[3px] p-3 mt-2">
            <div className="flex items-center gap-3">
              <div className="order-detail__description w-[60px] mb-1 flex items-center">
                <Image
                  className="w-[100%]"
                  objectFit="contain"
                  src={Images.logo.pageWolmartLogoSmartphone}
                  width={148}
                  height={48}
                />
              </div>
              <span>{t("order:saveDelivery")}</span>
            </div>
            {/* <div className="order-detail__description mb-1 mt-2 pt-1">
              <span>{t("order:saveDelivery")}</span>
            </div> */}
            {/* <div className="order-detail__description">
              {t("order:freeShipping")}
            </div> */}
          </div>
        </Col>
        <Col span={8}>
          <div className="account__title text-sm">{t("order:payments")}</div>
          <div className="order-detail__box border rounded-[3px] p-3 mt-2">
            {/* <div className="order-detail__description mb-1">
              {t("order:onlinePayment")}
            </div> */}
            <div className="order-detail__description mb-1">
              {t("order:cashPaymentDelivery")}
            </div>
          </div>
        </Col>
      </Row>
      <Table
        className="mt-6 rounded-[3px]"
        columns={columns}
        dataSource={products}
        pagination={false}
        size="middle"
      />
      <div className="flex justify-between items-end">
        <Link href="/my-account/order">
          <span className="flex order-detail__back pb-2">
            <TiArrowBack className="mr-2" style={{ fontSize: "1.25rem" }} />{" "}
            {t("order:backMyOrders")}
          </span>
        </Link>
        <div className="text-right mt-6">
          <div className="order-manager__total mb-3">
            {t("order:provisional")}:
            <span className="font-semibold ml-1 text-base">
              {" "}
              {t("utilities:currency", {
                val: detailOrderData.amountUntaxed,
              })}
            </span>
          </div>
          <div className="order-manager__total mb-3">
            {t("order:transportationCosts")}:
            <span className="font-semibold ml-1 text-base">
              {t("utilities:currency", {
                val:
                  detailOrderData.amountTotal - detailOrderData.amountUntaxed,
              })}
            </span>
          </div>
          <div className="order-manager__total mb-3">
            {t("common:total")}:
            <span className="text-red-500 font-semibold ml-1 text-base">
              {t("utilities:currency", {
                val: detailOrderData.amountTotal,
              })}
            </span>
          </div>
        </div>
      </div>
      <CommentProduct
        className="customer-infor-modal"
        onCancel={() => setComment(false)}
        visible={comment}
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

OrderDetail.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default OrderDetail;
