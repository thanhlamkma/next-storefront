import { Col, Row } from "antd";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useEffect, useState } from "react";
import { BiLeftArrow } from "react-icons/bi";
import { lastValueFrom, map } from "rxjs";
import Images from "src/assets/images";
import Layout from "src/components/layout";
import ProductDetailContent from "src/components/products/productDetail/productDetailContent";
import ProductOther from "src/components/products/productDetail/productOther";
import ProductSideBar from "src/components/products/productDetail/productSidebar";
import SlideCart from "src/components/products/productDetail/SlideCart";
import { useJob } from "src/core/hooks";
import JobState from "src/core/models/JobState";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { Product } from "src/data/products";
import { CreateResponse } from "src/models/Partner";
import {
  ListAttributeProductResponse,
  ListCountStarRatingRequest,
  ListCountStarRatingResponse,
  ListIdAccountProductsResponse,
  ListRatingProductsResponse,
  ProductDetailResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import BuyLaterProductRepository from "src/repositories/BuyLaterProductRepository";
import FavouriteProductRepository from "src/repositories/FavouriteProductRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import ProductRepository from "src/repositories/ProductRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";

interface ProductDetailProps {
  productDetailData: ProductDetailResponse | null;
  ratingProductData: ListCountStarRatingResponse | null;
  feedbackProductData: ListRatingProductsResponse | null;
  vendorDetailData: CreateResponse | null;
  relativeProductData: ProductDetailResponse[] | [];
  attributeProductData: ListAttributeProductResponse | null;
  favouriteProductIds?: ListIdAccountProductsResponse | null;
  buyLaterProductIds?: ListIdAccountProductsResponse | null;
}

interface ImageProduct {
  id: number | string;
  text?: string;
  image: string;
}

export const getServerSideProps = getServerSidePropsWithApi(async (context) => {
  const { locale, req, res } = context;
  const session = await unstable_getServerSession(
    req,
    res,
    getNextAuthConfig()
  );

  var propsData: ProductDetailProps = {
    attributeProductData: null,
    feedbackProductData: null,
    productDetailData: null,
    ratingProductData: null,
    relativeProductData: [],
    vendorDetailData: null,
    favouriteProductIds: null,
    buyLaterProductIds: null,
  };

  try {
    const { data: productDetailData } = await lastValueFrom(
      ProductRepository.getOne(Number(context.params?.id))
    );
    propsData.productDetailData = productDetailData;

    const { data: ratingProductData } = await lastValueFrom(
      RatingProductRepository.countStarRating({
        productId: [Number(context.params?.id)],
      })
    );
    propsData.ratingProductData = ratingProductData;

    const { data: feedbackProductData } = await lastValueFrom(
      RatingProductRepository.getListByProduct(
        Number(context.params?.id as string)
      )
    );
    propsData.feedbackProductData = feedbackProductData;

    if (
      productDetailData.productProducerOdoo &&
      productDetailData.productProducerOdoo.producerId
    ) {
      const { data: vendorDetailData } = await lastValueFrom(
        PartnerRepository.getVendorDetail(
          productDetailData.productProducerOdoo.producerId
        )
      );
      propsData.vendorDetailData = vendorDetailData;
    }

    const { data: relativeProductData } = await lastValueFrom(
      ProductRepository.getRelativeProduct({
        productTmplId: Number(context.params?.id),
        take: 6,
      })
    );
    propsData.relativeProductData = relativeProductData;

    const { data: attributeProductData } = await lastValueFrom(
      ProductRepository.getAttributeByOdooid({
        productId: productDetailData.odooId.split(",").map((id) => Number(id)),
      })
    );
    propsData.attributeProductData = attributeProductData;

    if (session) {
      const { data: favouriteProductIds } = await lastValueFrom(
        FavouriteProductRepository.get()
      );
      propsData.favouriteProductIds = favouriteProductIds;

      const { data: buyLaterProductIds } = await lastValueFrom(
        BuyLaterProductRepository.get()
      );
      propsData.buyLaterProductIds = buyLaterProductIds;
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
});

const ProductDetail: PageComponent<ProductDetailProps> = (props) => {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  // Fetch Relative Product Data
  const [listRelativeProducts, setListRelativeProducts] = useState<
    Product[] | undefined
  >();

  // Fetch List Star Rating
  const [listStarRating, setListStarRating] =
    useState<ListCountStarRatingResponse>([]);
  const {
    run: getListStarRating,
    result,
    state,
  } = useJob((data: ListCountStarRatingRequest) => {
    return RatingProductRepository.getListCountStarRating(data).pipe(
      map((data) => {
        return data.data;
      })
    );
  });

  useEffect(() => {
    if (JobState.Success === state && result) {
      setListStarRating(result);
    }
  }, [state, result]);

  useEffect(() => {
    if (props.relativeProductData && props.relativeProductData.length > 0) {
      const requestIds: number[] = [];

      props.relativeProductData.forEach((product, index) => {
        Number.isInteger(Number(product.productTmplId)) &&
          requestIds.push(Number(product.productTmplId));
      });
      if (requestIds && requestIds.length > 0) {
        getListStarRating({
          productId: requestIds,
        });
      }
    }
  }, [listRelativeProducts]);

  // Product With Star And Rating
  const [listProductsWithStarRating, setListProductsWithStarRating] = useState<
    Product[]
  >([]);

  useEffect(() => {
    let returningData: Product[] = [];

    if (listRelativeProducts) {
      if (listStarRating.length) {
        returningData = listRelativeProducts?.map((product) => {
          const index = listStarRating.findIndex(
            (start) => start.productId.toString() === product.id?.toString()
          );
          if (index !== -1) {
            return {
              ...product,
              reviews: listStarRating[index].total,
              star: Math.floor(listStarRating[index].average),
            };
          } else return { ...product };
        });

        // console.log("After Map Data", returningData);
      } else returningData = listRelativeProducts;
    } else returningData = [];
    // console.log("Final Data: ", returningData);
    setListProductsWithStarRating(returningData);
  }, [listStarRating, listRelativeProducts]);

  const handleToggleSidebar = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  useEffect(() => {
    const layoutElement = document.querySelector("#layout") as HTMLDivElement;
    const bodyElement = document.querySelector("body") as HTMLBodyElement;
    if (showSideBar) {
      layoutElement.classList.add("show-product-side-bar");
      bodyElement.style.overflowX = "hidden";
    } else {
      layoutElement.classList.remove("show-product-side-bar");
      bodyElement.style.overflowX = "auto";
    }
  }, [showSideBar]);

  useEffect(() => {
    if (props.relativeProductData) {
      const listProductData = [] as Array<Product>;
      props.relativeProductData.forEach((resProduct) => {
        listProductData.push({
          id: resProduct.productTmplId,
          price: resProduct.price.toString(),
          name: resProduct.name || "",
          image:
            resProduct.productImageOdoo &&
            resProduct.productImageOdoo.length > 0
              ? "data:image/png;base64," + resProduct.productImageOdoo[0].image
              : Images.product.noProductImg,
          star: 0,
          reviews: 0,
          priceReal: resProduct.finalPrice?.toString() || "0",
          quantity: resProduct.qtyAvailable,
        });
      });

      setListRelativeProducts(listProductData);
    } else {
      setListRelativeProducts([]);
    }
  }, [props.relativeProductData]);
  
  return (
    <div id="product-detail" className="mt-6">
      <div className="container">
        <Row gutter={30}>
          <Col className="main-content">
            <SlideCart
              productDetail={props.productDetailData}
              ratingProduct={props.ratingProductData}
              attributeProduct={props.attributeProductData}
            />
            <div className="pt-6 pb-10">
              {/* view description, specification, vendor info... */}
              <ProductDetailContent
                productDetail={props.productDetailData}
                ratingProduct={props.ratingProductData}
                feedbackProduct={props.feedbackProductData}
                vendorDetail={props.vendorDetailData}
              />
              {/* view list products section */}
              <ProductOther
                productId={props.productDetailData?.productTmplId}
                relativeProduct={listProductsWithStarRating}
                favouriteProductIds={props.favouriteProductIds}
                buyLaterProductIds={props.buyLaterProductIds}
              />
            </div>
          </Col>
          {/* view side bar */}

          <div
            className={`wrapper-product-sidebar ${
              showSideBar ? "active-product-sidebar" : ""
            }`}
          >
            <div
              className="toggle-show-sidebar mlg:hidden"
              onClick={handleToggleSidebar}
            >
              <BiLeftArrow fontSize={18} />
            </div>
            <div
              className="product-side-bar-mask"
              onClick={handleToggleSidebar}
            ></div>
            <Col className="side-bar">
              <ProductSideBar />
            </Col>
          </div>
        </Row>
      </div>
    </div>
  );
};

ProductDetail.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default ProductDetail;
