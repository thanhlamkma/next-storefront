import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
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
import { FilterValue, LimitValue } from "src/data/filter";
import { Product } from "src/data/products";
import {
  FavouriteProductRequest,
  ListCountStarRatingRequest,
  ListCountStarRatingResponse,
  ListIdAccountProductsResponse,
  ProductDetailResponse,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import FavouriteProductRepository from "src/repositories/FavouriteProductRepository";
import ProductRepository from "src/repositories/ProductRepository";
import RatingProductRepository from "src/repositories/RatingProductRepository";

interface WishlistProps {
  favouriteProductData: ProductDetailResponse[] | [];
  favouriteProductIds: ListIdAccountProductsResponse | null;
}

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: WishlistProps = {
      favouriteProductData: [],
      favouriteProductIds: null,
    };

    try {
      if (session) {
        const { data: favouriteProductIds } = await lastValueFrom(
          FavouriteProductRepository.get({
            pageSize: 9,
            pageIndex: 1,
          })
        );
        propsData.favouriteProductIds = favouriteProductIds;

        const { data: favouriteProductData } = await lastValueFrom(
          ProductRepository.getListProductByIds({
            productTmplId: favouriteProductIds.data,
            sort: "",
          })
        );
        propsData.favouriteProductData = favouriteProductData;
      }

      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        props: {
          ...(await serverSideTranslations(locale ? locale : "vi")),
          ...propsData,
        },
      };
    }
  }
);

const Wishlist: PageComponent<WishlistProps> = ({
  favouriteProductData,
  favouriteProductIds,
}) => {
  const session = useSession();
  const router = useRouter();

  const [productIds, setProductIds] = useState<number[] | undefined>(
    favouriteProductIds?.data
  );
  const [listProducts, setListProducts] = useState<Product[]>(() => {
    const listProductData = [] as Array<Product>;
    favouriteProductData.forEach((resProduct) => {
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
    result.limit = "9";
    result.page = 1;
    return result;
  });

  // Call API
  const { run: addFavouriteApi } = useJob(
    useCallback((data: FavouriteProductRequest) => {
      return FavouriteProductRepository.addFavouriteProduct(data).pipe(
        map((res: any) => {
          console.log("addSuccess:", res);
          if (favouriteProductIds)
            setProductIds(
              favouriteProductIds.data.filter(
                (item) => item !== data.productTemplateId
              )
            );
        }),
        catchError((err) => {
          console.log("addErr", err);
          return of(err);
        })
      );
    }, [])
  );

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

  // Handle remove favourite product
  const handleRemove = useCallback((id: number) => {
    console.log("remove id", id);
    addFavouriteApi({
      productTemplateId: id,
      isFavourite: false,
    });
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
    if (favouriteProductData) {
      const listProductData = [] as Array<Product>;
      favouriteProductData.forEach((resProduct) => {
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

    if (favouriteProductData && favouriteProductData.length > 0) {
      const requestIds: number[] = [];

      favouriteProductData.forEach((product, index) => {
        Number.isInteger(Number(product.productTmplId)) &&
          requestIds.push(Number(product.productTmplId));
      });
      if (requestIds && requestIds.length > 0) {
        getListStarRating({
          productId: requestIds,
        });
      }
    }
  }, [favouriteProductData]);

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
    <div id="wishlist" className="mb-5">
      <Products
        limit={filter.limit}
        page={filter.page}
        onLimitChange={handleLimitPageChange}
        onPageChange={handlePageChange}
        isFavorite={true}
        listProducts={listProductsWithStarRating}
        totalRecord={favouriteProductIds?.total}
        onRemoveFavor={handleRemove}
      />
    </div>
  );
};

Wishlist.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Wishlist;
