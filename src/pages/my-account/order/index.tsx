import { Card, Col, Pagination, Row, Spin } from "antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { GrInProgress } from "react-icons/gr";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { RiTruckLine } from "react-icons/ri";
import { TiCancelOutline } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Button from "src/components/Button";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { AddItemRequest, AddItemResponse } from "src/models/Carts";
import { GetDetailOrderResponse, GetOrderResponse } from "src/models/Order";
import {
  GetImagesByProductTmpRequest,
  GetImagesByProductTmpResponse,
  ListProductByIdResquest,
  ProductDetailResponse,
} from "src/models/Product";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import OrderRepository from "src/repositories/OrderRepository";
import ProductRepository from "src/repositories/ProductRepository";
import toast from "src/services/toast";

type ProductInOrderProps = {
  // item: CartProductDataType;
  onRepurchase: (data: AddItemRequest[]) => void;
  detailOrderData: GetDetailOrderResponse;
  imageProducts: ImageProduct[];
};

export type ImageProduct = {
  id: number;
  image: string;
};

interface Tab {
  key: "all" | "draft" | "sale" | "done" | "cancel";
  tab: ReactNode;
}

type FilterValue = {
  state?: number;
  limit?: number;
  page?: number;
};

interface OrderProps {
  // orderData: GetOrderResponse;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    try {
      // const { data: orderData } = await lastValueFrom(
      //   OrderRepository.get({
      //     pageIndex: 1,
      //     pageSize: 3,
      //     state: 0,
      //   })
      // );

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          // orderData,
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

const ProductInOrder: React.FC<ProductInOrderProps> = ({
  detailOrderData,
  onRepurchase,
  imageProducts,
}) => {
  const { t } = useTranslation();
  const statusOrder = useMemo(() => {
    switch (detailOrderData.state) {
      case "done":
        return (
          <div className="flex font-medium text-slate-500 text-sm border-b pb-4">
            <RiTruckLine className="mr-3" style={{ fontSize: "1.25rem" }} />
            {t("orderManagement:deliverySuccess")}
          </div>
        );
      case "draft":
        return (
          <div className="flex font-medium text-slate-500 text-sm border-b pb-4">
            <MdPendingActions
              className="mr-2"
              style={{ fontSize: "1.25rem" }}
            />
            {t("orderManagement:waitProcess")}
          </div>
        );
      case "sale":
        return (
          <div className="flex font-medium text-slate-500 text-sm border-b pb-4">
            <GrInProgress className="mr-2" style={{ fontSize: "1.25rem" }} />
            {t("orderManagement:confirm")}
          </div>
        );
      case "cancel":
        return (
          <div className="flex font-medium text-slate-500 text-sm border-b pb-4">
            <TiCancelOutline className="mr-2" style={{ fontSize: "1.25rem" }} />
            {t("common:cancelled")}
          </div>
        );
    }
  }, []);

  const handleRepurchase = () => {
    const data: AddItemRequest[] = [];
    detailOrderData.orderLines.map((item) => {
      data.push({
        name: item.name,
        priceUnit: item.priceUnit,
        productId: item.productId,
        productTemplateId: item.productTemplateId,
        productUomQty: item.productUomQty,
        image: getImg(item.productTemplateId),
        // qtyAvailable: 0,
      });
    });
    onRepurchase(data);
  };

  const setTotal = () => {
    var total: number = 0;
    detailOrderData.orderLines.map((item) => {
      total = total + item.productUomQty;
    });
    return total;
  };

  // Get image product
  const getImg = (id: number) => {
    const img: ImageProduct[] = imageProducts.filter((img) => img.id === id);
    return img[0] ? img[0].image : Images.product.noProductImg;
  };

  return (
    <div id="group-item-order" className="mt-2 border p-4 rounded-[3px]">
      {statusOrder}
      <p className="m-0 mt-3 font-semibold">
        {t("orderManagement:productNumber")}: {setTotal()}
      </p>
      {detailOrderData.orderLines.map((item, index) => {
        if (index === 0) {
          return (
            <Row
              gutter={{
                xs: 0,
                md: 10,
              }}
              className="cart-product py-[12px] border-b"
            >
              <Col
                xs={{
                  span: 24,
                }}
                md={19}
                className="product-img-name flex md:flex-row s:flex-col"
              >
                <div className="cart-product-img-wrapper relative xs:max-w-[100px] md:max-w-[100px]">
                  <div className="order-manager-img-wrapper p-2 border overflow-hidden">
                    <Image
                      src={getImg(item.productTemplateId)}
                      width={250}
                      height={288}
                      objectFit="contain"
                    />
                    <div className="order-manager-quantity absolute min-w-[34px] h-[32px] flex items-center justify-center">
                      x{item.productUomQty}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="cart-product-name flex-1 xs:mb-[5px] md:mx-0 pl-[20px] block">
                    {item.name}
                  </span>
                  <span className="order-manager-store-name pl-[20px] flex">
                    <IoStorefrontOutline
                      className="mr-[8px] relative top-[1px]"
                      style={{ fontSize: "1rem" }}
                    />
                    Tii24h.com
                  </span>

                  <span className="pl-[20px] xs:flex md:hidden font-semibold">
                    {t("utilities:currency", {
                      val: (item.priceUnit * item.productUomQty).toFixed(2),
                    })}
                  </span>
                </div>
              </Col>
              <Col
                md={5}
                xs={{
                  span: 24,
                }}
                className="product-subtotal flex xs:hidden md:flex xs:justify-center md:justify-end text-[16px] font-semibold"
              >
                {t("utilities:currency", {
                  val: (item.priceUnit * item.productUomQty).toFixed(2),
                })}
              </Col>
            </Row>
          );
        }
      })}
      <div className="flex xs:flex-col-reverse 2sm:flex-row justify-end items-start">
        {/* <Button className="xs:w-full 2sm:w-[unset] rounded-[3px] sm:text-sm mt-4 order-manager__btn xs:text-xs">
          {t("orderManagement:viewMoreCount", { count: 4 })}
        </Button> */}
        <div className="xs:w-full 2sm:w-[unset] xs:text-center 2sm:text-right mt-4">
          <div className="order-manager__total text-base mb-3">
            {t("cart:totalMoney")}:
            <span className="text-lg font-semibold ml-1">
              {" "}
              {t("utilities:currency", {
                val: detailOrderData.amountTotal,
              })}
            </span>
          </div>
          <div className="btn-area flex">
            <Button
              className="flex-1 account__btn px-7 h-[36px] rounded-[3px] text-sm"
              onClick={handleRepurchase}
            >
              {t("orderManagement:repurchase")}
            </Button>
            <Link href={`/my-account/order/${detailOrderData.id}`}>
              <Button className="flex-1 account__btn px-7 h-[36px] rounded-[3px] ml-4 text-sm">
                {t("common:showMore")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderManager: PageComponent<OrderProps> = (props) => {
  // const [orders, setOrder] = useState<Array<CartProductDataType> | []>(
  //   cartProductData
  // );
  const { t } = useTranslation();
  const tabList: Array<Tab> = useMemo(
    () => [
      { key: "all", tab: t("common:all") },
      // { key: "pending-pay", tab: t("orderManagement:waitPay") },
      {
        key: "draft",
        tab: t("orderManagement:waitProcess"),
      },
      { key: "sale", tab: t("orderManagement:confirm") },
      { key: "done", tab: t("orderManagement:delivered") },
      { key: "cancel", tab: t("common:cancelled") },
    ],
    [t]
  );

  const [ordersData, setOrdersData] = useState<GetOrderResponse>();
  // const [collapseOrdersData, setCollapseOrderData]
  const [activeTab, setActiveTab] = useState<Tab>(tabList[0]);
  const [filter, setFilter] = useState<FilterValue>({
    limit: 3,
    page: 1,
    state: 0,
  });
  const [imagesData, setImagesData] = useState<ImageProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { setCart: setCartRedux } = cartModule.actions.creators;

  // Call API
  const { run: getImagesApi } = useJob((data: ListProductByIdResquest) => {
    return ProductRepository.getListProductByIds(data).pipe(
      map(({ data }: { data: ProductDetailResponse[] }) => {
        const imgData: ImageProduct[] = [];
        data.map((item) => {
          imgData.push({
            id: item.productTmplId,
            image:
              item.productImageOdoo && item.productImageOdoo[0]
                ? "data:image/png;base64," + item.productImageOdoo[0].image
                : Images.product.noProductImg,
          });
        });
        setImagesData(imgData);
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
              image:
                item.productImageOdoo && item.productImageOdoo[0]
                  ? "data:image/png;base64," + item.productImageOdoo[0].image
                  : Images.product.noProductImg,
            });
          });
          setImagesData(imgData);
        }),
        catchError((err) => {
          console.log("get img err", err);
          return of(err);
        })
      );
    }
  );

  const { run: getOrdersApi } = useJob(() => {
    return OrderRepository.get({
      pageIndex: filter.page,
      pageSize: filter.limit,
      state: filter.state,
    }).pipe(
      map(({ data }: { data: GetOrderResponse }) => {
        setOrdersData(data);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        const idArr: number[] = [];
        if (data) {
          data.data.map((order) => {
            order.orderLines.map((item) => {
              if (!idArr.includes(item.productTemplateId))
                idArr.push(item.productTemplateId);
            });
          });
        }
        // getImagesApi({ productTmplId: idArr });
        getImagesProductApi({ productTmplId: idArr });
      }),
      catchError((err) => {
        console.log("get order err", err);
        return of(err);
      })
    );
  });

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
      }),
      catchError((err) => {
        console.log("add err", err);
        toast.show("error", t("products:errProduct"));
        return of(err);
      })
    );
  });

  useEffect(() => {
    getOrdersApi();
  }, [filter]);

  // Set filter state when click tabs
  const onTabChange = useCallback(
    (key: string) => {
      const tabActive = tabList.find((item) => item.key === key);
      var state: number = 0;
      if (tabActive) {
        if (tabActive.key === "all") {
          state = 0;
        } else if (tabActive.key === "draft") {
          state = 1;
        } else if (tabActive.key === "sale") {
          state = 2;
        } else if (tabActive.key === "done") {
          state = 4;
        } else if (tabActive.key === "cancel") {
          state = 3;
        }
        setFilter(() => ({
          limit: 3,
          page: 1,
          state: state,
        }));
        setActiveTab(tabActive);
      }
    },
    [tabList]
  );

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const onPageChange = useCallback((page: number) => {
    handlePageChange(page);
  }, []);

  const renderPagination = useMemo(() => {
    return ordersData && ordersData.data.length > 0 ? (
      <Pagination
        current={filter.page}
        total={ordersData.total}
        pageSize={filter.limit}
        onChange={onPageChange}
      />
    ) : (
      <></>
    );
  }, [ordersData, filter]);

  // Handle repurchase
  const handleRepurchase = (data: AddItemRequest[]) => {
    data.map((item, index) => {
      setTimeout(() => {
        addItemApi(item);
      }, 300 * index);
    });
    toast.show("success", t("products:addItemSuccess"));
  };

  return (
    <div id="order-manager">
      <Head>
        <title>{t("myAccount:myOrders")}</title>
      </Head>
      <Card
        className="tab-order-manager"
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTab.key}
        onTabChange={(key: any) => {
          onTabChange(key);
        }}
      >
        <div className="list-order-manager">
          {/* <div className="order-manager__filter relative">
            <Input
              allowClear
              placeholder={t("orderManagement:findInformation")}
              prefix={
                <IoSearchOutline
                  className="mr-2"
                  style={{ fontSize: "1.25rem", color: "#6c757d" }}
                />
              }
            />
            <Button className="order-manager__btn-search absolute border-0 border-l">
              {t("orderManagement:findOrders")}
            </Button>
          </div> */}
          <Spin spinning={loading}>
            {ordersData && ordersData.data.length > 0 ? (
              <div>
                {ordersData.data.map((order) => (
                  <ProductInOrder
                    key={`product-${order.name}`}
                    detailOrderData={order}
                    onRepurchase={handleRepurchase}
                    imageProducts={imagesData}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col justify-center items-center gap-4 py-5">
                <Image
                  className="opacity-30"
                  src={Images.order.noOrder}
                  width={130}
                  height={130}
                />
                <div className="mb-4 md:text-base text-sm text-gray-500">
                  {t("orderManagement:noOrders")}
                </div>
              </div>
            )}
          </Spin>
          <div className="flex justify-center mt-5">{renderPagination}</div>
        </div>
      </Card>
    </div>
  );
};

OrderManager.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default OrderManager;
