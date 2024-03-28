import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import Layout from "src/components/layout";
import LayoutAccount from "src/components/layout/LayoutAccount";
import ReviewProductList from "src/components/products/ReviewProduct/ReviewProductList";
import { useJob } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { Product } from "src/data/products";
import {
  GetProductNotRatingRequest,
  GetProductNotRatingResponse,
  ProductNotRating,
} from "src/models/Order";
import {
  GetImagesByProductTmpRequest,
  GetImagesByProductTmpResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import { ImageProduct } from "src/pages/my-account/order";
import OrderRepository from "src/repositories/OrderRepository";
import ProductRepository from "src/repositories/ProductRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";

interface ReviewProductsProps {
  productNotRatingData: GetProductNotRatingResponse | null;
  saleOrderLineIds: number[] | [];
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: ReviewProductsProps = {
      productNotRatingData: null,
      saleOrderLineIds: [],
    };

    try {
      if (session) {
        const { data: saleOrderLineIds } = await lastValueFrom(
          RatingProductRepository.getAllRatingByUser()
        );
        propsData.saleOrderLineIds = saleOrderLineIds;

        const { data: productNotRatingData } = await lastValueFrom(
          OrderRepository.getProductNotRating({
            pageIndex: 1,
            pageSize: 1,
            state: 4,
            saleOrderLineIds: saleOrderLineIds,
          })
        );
        propsData.productNotRatingData = productNotRatingData;
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (err) {
      console.log("get list err", err);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

export type FilterType = {
  limit: number;
  page: number;
};

const ReviewProducts: PageComponent<ReviewProductsProps> = ({
  productNotRatingData,
  saleOrderLineIds: saleOrderIds,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const [filter, setFilter] = useState<FilterType>({
    limit: 6,
    page: 1,
  });

  const [productsNotRating, setProductsNotRating] = useState<
    ProductNotRating[] | undefined
  >(productNotRatingData?.data);
  const [saleOrderLineIds, setSaleOrderLineIds] =
    useState<number[]>(saleOrderIds);
  const [productData, setProductData] = useState<Product[]>([]);
  const [imagesData, setImagesData] = useState<ImageProduct[]>();

  // Call API
  const { run: getSaleOrderLineApi } = useJob(() => {
    return RatingProductRepository.getAllRatingByUser().pipe(
      map(({ data }: { data: number[] }) => {
        console.log("get saleOrderLineIds", data);
        setSaleOrderLineIds(data);
      }),
      catchError((err) => {
        console.log("get saleOrderLineIds", err);
        return of(err);
      })
    );
  });

  const { run: getProductNotRatingApi } = useJob(
    (data: GetProductNotRatingRequest) => {
      return OrderRepository.getProductNotRating(data).pipe(
        map(({ data }: { data: GetProductNotRatingResponse }) => {
          setProductsNotRating(data.data);
        }),
        catchError((err) => {
          console.log("get prdnotrating err", err);
          return of(err);
        })
      );
    }
  );

  const { run: getImagesProductApi } = useJob(
    (data: GetImagesByProductTmpRequest) => {
      return ProductRepository.getImagesByProductTmpId(data).pipe(
        map(({ data }: { data: GetImagesByProductTmpResponse[] }) => {
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

  useEffect(() => {
    if (session.status === "authenticated") {
      getProductNotRatingApi({
        pageIndex: filter.page,
        pageSize: filter.limit,
        state: 4,
        saleOrderLineIds: saleOrderLineIds,
      });
    }
  }, [session.status, filter]);

  useEffect(() => {
    const idArr: number[] = [];
    if (productsNotRating) {
      productsNotRating.map((item) => {
        if (!idArr.includes(item.productTemplateId))
          idArr.push(item.productTemplateId);
      });
    }
    getImagesProductApi({ productTmplId: idArr });

    const products: Product[] = [];
    if (productsNotRating) {
      productsNotRating.map((prd) => {
        // if (!products.map((item) => item.id).includes(prd.productTemplateId)) {
        products.push({
          id: prd.productTemplateId,
          name: prd.name,
          image: imagesData?.filter(
            (item) => item.id === prd.productTemplateId
          )[0]?.image,
          saleOrderLineId: prd.id,
        });
        // }
      });
    }
    setProductData(products);
  }, [productsNotRating]);

  // Handle rating
  const handleRating = useCallback((saleOrderLineId?: number) => {
    if (saleOrderLineId) {
      var saleOrderFake: number[] = saleOrderLineIds;
      saleOrderFake.push(saleOrderLineId);
      setSaleOrderLineIds(saleOrderFake);
      console.log("oke", saleOrderLineIds);
      getProductNotRatingApi({
        state: 4,
        saleOrderLineIds: saleOrderLineIds,
      });
    }
  }, []);

  // Handle change page
  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  return (
    <div id="review-products" className="mb-5">
      <Head>
        <title>{t("myAccount:reviewProduct")}</title>
      </Head>
      <ReviewProductList
        productData={productData}
        onRating={handleRating}
        limit={filter.limit}
        page={filter.page}
        totalRecord={productNotRatingData?.total}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

ReviewProducts.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default ReviewProducts;
