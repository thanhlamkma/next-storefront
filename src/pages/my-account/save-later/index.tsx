import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import { Products } from "src/components/products";
import { useJob } from "src/core/hooks";
import JobState from "src/core/models/JobState";
import { getServerSidePropsWithApi } from "src/core/ssr";
import { FilterValue, LimitValue, optionViewer } from "src/data/filter";
import { Product } from "src/data/products";
import {
  ListCountStarRatingRequest,
  ListCountStarRatingResponse,
  ListIdAccountProductsResponse,
  ProductDetailResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import { checkValidValue } from "src/pages/products";
import BuyLaterProductRepository from "src/repositories/BuyLaterProductRepository";
import ProductRepository from "src/repositories/ProductRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";
interface SaveLaterProps {
  buyLaterProductData: ProductDetailResponse[] | [];
  buyLaterProductIds: ListIdAccountProductsResponse | null;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: SaveLaterProps = {
      buyLaterProductData: [],
      buyLaterProductIds: null,
    };

    try {
      if (session) {
        const { data: buyLaterProductIds } = await lastValueFrom(
          BuyLaterProductRepository.get({
            pageIndex: Number.isInteger(Number(context.query.page))
              ? Number(context.query.page)
              : undefined,
            pageSize: Number.isInteger(Number(context.query.limit))
              ? Number(context.query.limit)
              : undefined,
          })
        );
        propsData.buyLaterProductIds = buyLaterProductIds;

        const { data: buyLaterProductData } = await lastValueFrom(
          ProductRepository.getListProductByIds({
            productTmplId: buyLaterProductIds.data,
            sort: "",
          })
        );
        propsData.buyLaterProductData = buyLaterProductData;
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (err) {
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

const SaveLater: PageComponent<SaveLaterProps> = ({
  buyLaterProductData,
  buyLaterProductIds,
}) => {
  const router = useRouter();
  const [productIds, setProductIds] = useState<number[] | undefined>(
    buyLaterProductIds?.data
  );
  const [listProducts, setListProducts] = useState<Product[]>(() => {
    const listProductData = [] as Array<Product>;
    buyLaterProductData.forEach((resProduct) => {
      listProductData.push({
        id: resProduct.productTmplId,
        price: resProduct.price.toString(),
        name: resProduct.name || "",
        image: resProduct.productImageOdoo[0]
          ? "data:image/png;base64," + resProduct.productImageOdoo[0].image
          : Images.product.noProductImg,
        star: 0,
        reviews: 0,
        priceReal: resProduct.finalPrice?.toString() || "0",
        quantity: resProduct.qtyAvailable,
      });
    });
    return listProductData;
  });
  const [filter, setFilter] = useState<FilterValue>(() => {
    const result = {} as FilterValue;
    if (checkValidValue<LimitValue>(router.query.limit, optionViewer)) {
      result.limit = router.query.limit as LimitValue;
    } else {
      result.limit = "9";
    }

    if (Number.isInteger(Number(router.query.page))) {
      result.page = Number(router.query.page);
    } else {
      result.page = 1;
    }
    return result;
  });

  // Call API
  const { run: removeItemApi } = useJob((productTemplateId: number) => {
    return BuyLaterProductRepository.removeBuyLaterProduct(
      productTemplateId
    ).pipe(
      map((data: any) => {
        console.log("addSuccess:", data);
        if (buyLaterProductIds)
          setProductIds(
            buyLaterProductIds.data.filter((item) => item !== productTemplateId)
          );
      }),
      catchError((err) => {
        console.log("addErr", err);
        return of(err);
      })
    );
  });

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

  // Product With Star And Rating
  const [listProductsWithStarRating, setListProductsWithStarRating] = useState<
    Product[]
  >([]);

  useEffect(() => {
    if (buyLaterProductData) {
      const listProductData = [] as Array<Product>;
      buyLaterProductData.forEach((resProduct) => {
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

      setListProducts(listProductData);
    } else {
      setListProducts([]);
    }

    if (buyLaterProductData && buyLaterProductData.length > 0) {
      const requestIds: number[] = [];

      buyLaterProductData.forEach((product, index) => {
        Number.isInteger(Number(product.productTmplId)) &&
          requestIds.push(Number(product.productTmplId));
      });
      if (requestIds && requestIds.length > 0) {
        getListStarRating({
          productId: requestIds,
        });
      }
    }
  }, [buyLaterProductData]);

  // Handle remove favourite product
  const handleRemove = useCallback((id: number) => {
    console.log("remove id", id);
    removeItemApi(id);
  }, []);

  const handleLimitPageChange = useCallback((value) => {
    setFilter((prev) => ({
      ...prev,
      limit: value as LimitValue,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...filter,
      },
    });
  }, [filter, productIds]);

  useEffect(() => {
    let returningData: Product[] = [];

    if (listProducts) {
      if (listStarRating.length) {
        returningData = listProducts?.map((product) => {
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
      } else returningData = listProducts;
    } else returningData = [];
    // console.log("Final Data: ", returningData);
    setListProductsWithStarRating(returningData);
  }, [listStarRating, listProducts]);

  return (
    <div id="save-later" className="mb-5">
      <Products
        limit={filter.limit}
        page={filter.page}
        onLimitChange={handleLimitPageChange}
        onPageChange={handlePageChange}
        isSaveLater={true}
        listProducts={listProductsWithStarRating}
        totalRecord={buyLaterProductIds?.total}
        onRemoveFavor={handleRemove}
      />
    </div>
  );
};

SaveLater.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default SaveLater;
