import { Col, Row } from "antd";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { lastValueFrom } from "rxjs";
import Images from "src/assets/images";
import YourRecentView from "src/components/home/YourRecentView";
import Layout from "src/components/layout";
import { CardProduct, SectionProduct } from "src/components/products";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { Product } from "src/data/products";
import { GetListBannerResponse } from "src/models/Banner";
import {
  ListProductsResponse,
  ProductCategory2,
  ProductDetailResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import BannerRepository from "src/repositories/BannerRepository";
import CategoryRepository from "src/repositories/CategoryRepository";
import ProductRepository from "src/repositories/ProductRepository";
import ViewedProductRepository from "src/repositories/ViewedProductRepository";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
  productData: ListProductsResponse | null;
  categoryIds: ProductCategory2[];
  bannerData: GetListBannerResponse | null;
  viewedProductData: ProductDetailResponse[];
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: Props = {
      bannerData: null,
      categoryIds: [],
      productData: null,
      viewedProductData: [],
    };

    try {
      const { data: productData } = await lastValueFrom(
        ProductRepository.getListProducts({
          pageSize: 0,
          pageIndex: 0,
        })
      );
      propsData.productData = productData;

      const { data: categoryIds } = await lastValueFrom(
        CategoryRepository.get()
      );
      propsData.categoryIds = categoryIds;

      const { data: bannerData } = await lastValueFrom(BannerRepository.get());
      propsData.bannerData = bannerData;

      if (session) {
        const { data: viewedProductIds } = await lastValueFrom(
          ViewedProductRepository.get()
        );

        const { data: viewedProductData } = await lastValueFrom(
          ProductRepository.getListProductByIds({
            productTmplId: viewedProductIds.data,
          })
        );
        propsData.viewedProductData = viewedProductData;
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (err) {
      console.log("er", err);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

const Home: PageComponent<Props> = ({
  productData,
  categoryIds,
  bannerData,
  viewedProductData,
}) => {
  const { t } = useTranslation("home");
  const router = useRouter();
  const session = useSession();
  // Filter 3rd subcategory
  const [cateType3, setCateType3] = useState<number[]>(() => {
    var cateIds: number[] = [];
    categoryIds.map((cate) => {
      if (cate.parentPath.split("/").length === 4) cateIds.push(cate.id);
    });
    return cateIds;
  });
  // Filter 2nd subcategory
  const [cateType2, setCateType2] = useState<number[]>(() => {
    var cateIds: number[] = [];
    categoryIds.map((cate) => {
      if (cate.parentPath.split("/").length === 3) cateIds.push(cate.id);
    });
    return cateIds;
  });

  const setProductData = (categoryId: number) => {
    const listProductData = [] as Array<Product>;

    if (productData && productData.data.length > 0) {
      productData.data.forEach((resProduct) => {
        if (resProduct.productCategoryOdoo.categoryId === categoryId) {
          listProductData.push({
            id: resProduct.productTmplId,
            price: resProduct.price.toString(),
            name: resProduct.name || "",
            image: resProduct.productImageOdoo
              ? resProduct.productImageOdoo.length > 0
                ? "data:image/png;base64," +
                  resProduct.productImageOdoo[0].image
                : Images.product.noProductImg
              : Images.product.noProductImg,
            star: 0,
            reviews: 0,
            priceReal: resProduct.finalPrice?.toString() || "0",
            categoryId: resProduct.productCategoryOdoo.categoryId,
            categoryName: resProduct.productCategoryOdoo.name,
            quantity: resProduct.qtyAvailable,
          });
        }
      });
    }
    return listProductData;
  };

  const [productsCate1, setProductsCate1] = useState<Product[]>(
    setProductData(cateType3.length > 0 ? cateType3[0] : 1)
  );
  const [productsCate2, setProductsCate2] = useState<Product[]>(
    setProductData(cateType3.length > 1 ? cateType3[1] : 17)
  );
  const [productsCate3, setProductsCate3] = useState<Product[]>(
    setProductData(cateType3.length > 2 ? cateType3[2] : 20)
  );

  useEffect(() => {
    if (productsCate1.length === 0) setProductsCate1(setProductData(17));
    if (productsCate2.length === 0) setProductsCate2(setProductData(20));
    if (productsCate3.length === 0) setProductsCate3(setProductData(1));
  }, [cateType3]);
  console.log("product", productData);

  const [bannerSlide, setBannerSlide] = useState<string[]>(() => {
    var banner: string[] = [];
    bannerData &&
      bannerData.data.map((item) => {
        if (item.position === 1) banner.push(item.content);
      });
    return banner;
  });
  const [bannerBottom, setBannerBottom] = useState<string[]>(() => {
    var banner: string[] = [];
    bannerData &&
      bannerData.data.map((item) => {
        if (item.position === 2) banner.push(item.content);
      });
    return banner;
  });

  const handleRedirect = (categoryId: number | undefined) => {
    router.push(router.basePath + `/products?category=${categoryId}`);
  };

  return (
    <div id="home">
      <Head>
        <title>{t("home:home")}</title>
      </Head>
      <div className="wrap-slide">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="swiper-landing"
        >
          {bannerSlide.length > 0 &&
            bannerSlide.map((banner) => (
              <SwiperSlide className="flex items-center justify-center font-semibold text-2xl uppercase">
                <div dangerouslySetInnerHTML={{ __html: banner }}></div>
              </SwiperSlide>
            ))}
          {/* <SwiperSlide className="flex items-center justify-center font-semibold text-2xl uppercase">
            <Image
              src={Images.banner.banner1Tablet}
              width={1903}
              height={520}
              objectFit="contain"
            />
          </SwiperSlide> */}
        </Swiper>
      </div>
      <section className="py-[15px] py-md-[20px] py-xl-[30px]">
        <div className="container">
          <Row className="banner" gutter={16}>
            {bannerBottom.length > 0 &&
              bannerBottom.map((banner) => (
                <Col span={12}>
                  <div dangerouslySetInnerHTML={{ __html: banner }}></div>
                </Col>
              ))}
            {/* <Col span={12}>
              <div className="banner-1 px-6 flex justify-center flex-col">
                <div className="font-normal text-black-33 text-lg mb-[7px]">
                  {t("home:getUp")}{" "}
                  <span className="font-bold text-orange-500 text-lg">
                    20% OFF
                  </span>
                </div>
                <h3 className="uppercase font-bold text-[26px] leading-9 text-black-33">
                  Sports Outfits
                </h3>
                <h4 className="capitalize text-[26px] text-black-33 font-normal leading-8 mb-4">
                  {t("home:collection")}
                </h4>
                <div className="text-gray-66 text-sm">
                  {t("home:startingAt")}{" "}
                  <span className="font-bold text-orange-500">$170.00</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="banner-2 px-6 flex justify-center flex-col text-white">
                <div className="font-normal text-lg mb-[7px]">
                  New Arrivials
                </div>
                <h3 className="uppercase font-bold text-[26px] text-white leading-9">
                  Accessories
                </h3>
                <h4 className="capitalize text-[26px] text-white font-normal leading-8 mb-4">
                  {t("home:collection")}
                </h4>
                <div className="text-white text-sm">
                  {t("home:onlyFrom")}{" "}
                  <span className="font-bold text-orange-500">$170.00</span>
                </div>
              </div>
            </Col> */}
          </Row>
        </div>
      </section>

      {/* <section className="top-category bg-gray-f5">
        <div className="container py-[50px]">
          <h3 className="font-bold text-black-33 text-[20px] text-center">
            {t("home:topCategoriesMonth")}
          </h3>
          <Row gutter={[16, 16]}>
            {categoryHome.map((category) => (
              <Col
                lg={24 / categoryHome.length}
                sm={(24 / categoryHome.length) * 2}
                xs={12}
              >
                <div className="top-category-item cursor-pointer bg-white h-[180px]">
                  <Image
                    className="image-category"
                    src={category.image}
                    layout="fill"
                  ></Image>
                  <h3 className="title-category font-semibold text-black-33 text-sm text-center mb-2">
                    {category.title}
                  </h3>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section> */}

      {productsCate1.length > 0 ? (
        <section className="section-product py-[15px] py-md-[30px] py-xl-[40px]">
          <div className="container">
            <SectionProduct
              title={productsCate1[0].categoryName}
              onClickExpand={() => handleRedirect(productsCate1[0].categoryId)}
            >
              <Row className="row-cols-5" align="middle" gutter={[16, 32]}>
                {productsCate1.map((prd: Product) => (
                  <Col key={`${prd.id}-${prd.name}`} xl={4} md={8} span={10}>
                    <CardProduct {...prd} />
                  </Col>
                ))}
              </Row>
              {/* <Row gutter={16}>
              <Col xl={6} span={0}>
              <div
              className="w-full h-full image-ads image-ads1"
              // style={{
                //   backgroundImage: `url(${Images.banner.bannerAds1})`,
                  // }}
                >
                  <h5 className="text-lg text-black-33 font-normal">
                    {t("home:weekendSale")}
                  </h5>
                  <h3 className="font-bold text-3xl text-black-33">
                  NEW ARRIVALS
                  <br />
                  <span className="text-3x1 font-normal capitalize">
                      {t("home:collection")}
                    </span>
                  </h3>
                  <Button className="btn-dark">{t("home:shopNow")}</Button>
                </div>
              </Col>
              <Col xl={18} span={24}>
                <Row align="middle" gutter={[16, 32]}>
                  {listProduct.slice(0, 8).map((product: Product) => (
                    <Col
                      key={`${product.id}-clothings`}
                      xl={6}
                      md={8}
                      span={12}
                      >
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row> */}
            </SectionProduct>
          </div>
        </section>
      ) : (
        ""
      )}

      {productsCate2.length > 0 ? (
        <section className="section-product py-[20px]">
          <div className="container">
            <SectionProduct
              title={productsCate2[0].categoryName}
              onClickExpand={() => handleRedirect(productsCate2[0].categoryId)}
            >
              {/* <Row gutter={16}>
              <Col xl={6} span={0}>
                <div
                  className="w-full h-full image-ads image-ads2"
                  // style={{
                  //   backgroundImage: `url(${Images.banner.bannerAds2})`,
                  // }}
                >
                  <h5 className="text-lg text-white font-normal">
                    {t("home:newCollection")}
                  </h5>
                  <h3 className="font-bold text-3xl text-white">
                    TOP CAMERA
                    <br />
                    <span className="text-3x1 font-normal capitalize">
                      Mirrorless
                    </span>
                  </h3>
                  <Button className="btn-white">{t("home:shopNow")}</Button>
                  </div>
                  </Col>
                  <Col xl={18} span={24}>
                  <Row align="middle" gutter={[16, 32]}>
                  {listProduct.slice(0, 8).map((product: Product) => (
                    <Col
                    key={`${product.id}-clothings`}
                    xl={6}
                    md={8}
                      span={12}
                      >
                      <CardProduct {...product} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row> */}
              <Row className="row-cols-5" align="middle" gutter={[14, 30]}>
                {/* {listProduct.slice(0, 10).map((product: Product) => (
                <Col key={`${product.id}-clothings`} xl={4} md={8} span={10}>
                <CardProduct {...product} />
                </Col>
              ))} */}

                {productsCate2.map((prd: Product) => (
                  <Col key={`${prd.id}-${prd.name}`} xl={4} md={8} span={10}>
                    <CardProduct {...prd} />
                  </Col>
                ))}
              </Row>
            </SectionProduct>
          </div>
        </section>
      ) : (
        ""
      )}

      {productsCate3.length > 0 ? (
        <section className="section-product py-[20px]">
          <div className="container">
            <SectionProduct
              title={productsCate3[0].categoryName}
              onClickExpand={() => handleRedirect(productsCate3[0].categoryId)}
            >
              <Row className="row-cols-5" align="middle" gutter={[14, 30]}>
                {productsCate3.map((prd: Product) => (
                  <Col key={`${prd.id}-${prd.name}`} xl={4} md={8} span={10}>
                    <CardProduct {...prd} />
                  </Col>
                ))}
              </Row>
            </SectionProduct>
          </div>
        </section>
      ) : (
        ""
      )}
      {/* <OurClients /> */}
      {/* <FromOurBlog /> */}
      {session.status === "authenticated" &&
      viewedProductData &&
      viewedProductData.length > 0 ? (
        <YourRecentView viewedProductData={viewedProductData} />
      ) : (
        ""
      )}
    </div>
  );
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
