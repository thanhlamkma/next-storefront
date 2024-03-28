import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { catchError, lastValueFrom, map, of } from "rxjs";
import Images from "src/assets/images";
import { Filter, FilterCheckBox, FilterPrice } from "src/components/filter";
import Layout from "src/components/layout";
import { Category, Partner, Products } from "src/components/products";
import { useJob } from "src/core/hooks";
import JobState from "src/core/models/JobState";
import { getServerSidePropsWithApi } from "src/core/ssr";
import {
  DataSelect,
  FilterValue,
  LimitValue,
  optionSort,
  optionViewer,
  SortValue,
} from "src/data/filter";
import { Product } from "src/data/products";
import { GetListVendorResponse } from "src/models/Partner";
import {
  AttributeFilterResponse,
  GetListAttributeFilterResponse,
  ListCountStarRatingRequest,
  ListCountStarRatingResponse,
  ListIdAccountProductsResponse,
  ListProductsBodyRequest,
  ListProductsResponse,
  ProductCategory2,
} from "src/models/Product";
import { getNextAuthConfig } from "src/pages/api/auth/[...nextauth]";
import BuyLaterProductRepository from "src/repositories/BuyLaterProductRepository";
import CategoryRepository from "src/repositories/CategoryRepository";
import FavouriteProductRepository from "src/repositories/FavouriteProductRepository";
import PartnerRepository from "src/repositories/PartnerRepository";
import ProductRepository from "src/repositories/ProductRepository";
import ProductRatingRepository from "src/repositories/RatingProductRepository";

interface ListProductsProps {
  productData: ListProductsResponse | null;
  attributeData: AttributeFilterResponse[] | [];
  attributeData2: GetListAttributeFilterResponse | [];
  favouriteProductIds?: ListIdAccountProductsResponse | null;
  buyLaterProductIds?: ListIdAccountProductsResponse | null;
  vendorData: GetListVendorResponse | null;
  categoryData: ProductCategory2[] | [];
}

export const checkValidValue = function <T extends string = any>(
  value: string | string[] | undefined,
  optionValues: DataSelect<T>[]
) {
  return optionValues.some((option) => {
    return value === option.value;
  });
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale, req, res } = context;
    const session = await unstable_getServerSession(
      req,
      res,
      getNextAuthConfig()
    );

    let propsData: ListProductsProps = {
      productData: null,
      attributeData: [],
      attributeData2: [],
      favouriteProductIds: null,
      buyLaterProductIds: null,
      vendorData: null,
      categoryData: [],
    };

    try {
      const { data: productData } = await lastValueFrom(
        ProductRepository.getListProducts({
          pageSize: Number.isInteger(Number(context.query.limit))
            ? Number(Number(context.query.limit))
            : undefined,
          sort: context.query.sort as string | undefined,
          name: (context.query.search as string) || undefined,
          pageIndex: Number.isInteger(Number(context.query.page))
            ? Number(Number(context.query.page))
            : undefined,
          productCategoryId: Number.isInteger(Number(context.query.category))
            ? context.query.category?.toString()
            : undefined,
          minPrice: Number.isInteger(Number(context.query.min))
            ? Number(context.query.min)
            : undefined,
          maxPrice: Number.isInteger(Number(context.query.max))
            ? Number(context.query.max)
            : undefined,
        })
      );
      propsData.productData = productData;

      const { data: attributeData } = await lastValueFrom(
        ProductRepository.getAttribute()
      );
      propsData.attributeData = attributeData;

      const { data: attributeData2 } = await lastValueFrom(
        ProductRepository.getAttributeFilter({
          name: (context.query.search as string) || "",
        })
      );
      propsData.attributeData2 = attributeData2;

      const { data: vendorData } = await lastValueFrom(
        PartnerRepository.getListVendor({
          pageIndex: 1,
          pageSize: 7,
        })
      );
      propsData.vendorData = vendorData;

      const { data: categoryData } = await lastValueFrom(
        CategoryRepository.get()
      );
      propsData.categoryData = categoryData;

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
      // else {
      //   console.log("unauthorized");
      // }

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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { locale } = context;

//   const session = await getSession(context);

//   return {
//     props: {
//       ...(await serverSideTranslations(locale ? locale : "vi")),
//     },
//   };
// };

const ListProducts: PageComponent<ListProductsProps> = ({
  productData,
  attributeData,
  attributeData2,
  favouriteProductIds,
  buyLaterProductIds,
  vendorData,
  categoryData,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const setListProductData = (data: ListProductsResponse | null) => {
    if (data && data.data) {
      const listProductData = [] as Array<Product>;
      data.data.forEach((resProduct) => {
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
  };

  // Fetch Attribute List Data
  const [listAttribute, setListAttribute] =
    useState<GetListAttributeFilterResponse>(attributeData2);

  // Fetch Product Data
  const [listProducts, setListProducts] = useState<Product[] | undefined>();

  useEffect(() => {
    setListProductData(productData);
  }, [productData, session.status]);

  // const renderProduct = useMemo(() => {}, [session.status]);

  // Fetch List Star Rating
  const [listStarRating, setListStarRating] =
    useState<ListCountStarRatingResponse>([]);
  const {
    run: getListStarRating,
    result,
    state,
  } = useJob((data: ListCountStarRatingRequest) => {
    return ProductRatingRepository.getListCountStarRating(data).pipe(
      map((data) => {
        return data.data;
      })
    );
  });

  useEffect(() => {
    if (productData && productData.data) {
      const requestIds: number[] = [];

      productData.data.forEach((product, index) => {
        Number.isInteger(Number(product.productTmplId)) &&
          requestIds.push(Number(product.productTmplId));
      });
      if (requestIds && requestIds.length > 0) {
        getListStarRating({
          productId: requestIds,
        });
      }
    }
  }, [productData]);

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

  // Handle filter list product
  const [filter, setFilter] = useState<FilterValue>(() => {
    const result = {} as FilterValue;

    if (checkValidValue<LimitValue>(router.query.limit, optionViewer)) {
      result.limit = router.query.limit as LimitValue;
    } else {
      result.limit = "9";
    }

    if (checkValidValue<SortValue>(router.query.sort, optionSort)) {
      result.sort = router.query.sort as SortValue;
    } else {
      result.sort = "default";
    }

    if (Number.isInteger(Number(router.query.page))) {
      result.page = Number(router.query.page);
    } else {
      result.page = 1;
    }

    return result;
  });

  const handleLimitPageChange = useCallback((value) => {
    setFilter((prev) => ({
      ...prev,
      limit: value as LimitValue,
    }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilter((prev) => ({
      ...prev,
      sort: value as SortValue,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  // Handle choose attribute
  const [attr, setAttr] = useState<number[]>([]);
  const [unCheck, setUncheck] = useState<boolean>(false);

  const { run: getProductApi } = useJob((data: ListProductsBodyRequest) => {
    console.log("oke");
    return ProductRepository.getListProducts(data).pipe(
      map(({ data }: { data: ListProductsResponse }) => {
        console.log("get prd success", data);
        setListProductData(data);
      }),
      catchError((err) => {
        console.log("get prd err", err);
        return of(err);
      })
    );
  });

  const handleAttributeChange = (e: CheckboxChangeEvent) => {
    setUncheck(false);
    var attrChosen: number[] = attr;
    const value: number = Number(e.target.value);
    if (!attrChosen.includes(value)) {
      attrChosen.push(value);
    } else {
      attrChosen = attrChosen.filter((item) => item !== value);
    }
    setAttr(attrChosen);
    console.log("attrChosen", attrChosen);
    if (attrChosen.length > 0) {
      getProductApi({
        pageIndex: 1,
        pageSize: 9,
        attribuleFilterInputs: [
          {
            attributeId: 0,
            attributeValueIds: attrChosen,
          },
        ],
      });
    } else {
      getProductApi({
        pageIndex: 1,
        pageSize: 9,
      });
    }
  };

  const handleShowFilter = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  // Handle Transalte All Layout When Show Filter
  useEffect(() => {
    const layoutElement = document.querySelector("#layout") as HTMLDivElement;
    const bodyElement = document.querySelector("body") as HTMLBodyElement;
    const mainLoading = document.querySelector(
      "#main-spin-container"
    ) as HTMLDivElement;
    if (showFilter) {
      layoutElement.classList.add("body-show-product-filters");
      bodyElement.style.overflowX = "hidden";
      mainLoading.style.overflowX = "hidden";
    } else {
      layoutElement.classList.remove("body-show-product-filters");

      setTimeout(() => {
        bodyElement.style.overflowX = "unset";
        mainLoading.style.overflowX = "unset";
      }, 500);
    }
  }, [showFilter]);

  const handleApply = (price1: string, price2: string) => {
    setFilter((prev) => ({
      ...prev,
      min: price1 !== "" ? Number(price1) : 0,
      max: price2 !== "" ? Number(price2) : 0,
    }));
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setUncheck(true);
    setFilter(() => {
      const result = {} as FilterValue;
      result.limit = "9";
      result.sort = "default";
      result.page = 1;
      result.search = "";
      result.max = 0;
      result.min = 0;
      return result;
    });
  };

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...filter,
      },
    });
  }, [filter]);

  return (
    <>
      <Head>
        <title>{t("products:productList")}</title>
      </Head>
      <div id="list-products">
        <div className="container">
          {/* <Banner /> */}
          <Partner vendorData={vendorData} />
          <div className="pb-6 mb-[35px]">
            <Category categoryData={categoryData} />
          </div>
          <div className="wrap-content gap-8">
            <div
              className={`filter-wrapper-container ${
                showFilter ? "show-products-filters" : ""
              } z-[999]`}
            >
              <div
                className="products-filter-mask"
                onClick={handleShowFilter}
              ></div>
              <div className={`wrap-filter z-[1]`}>
                <Filter onClearFilter={handleClearFilter}>
                  {/* <FilterCategory filterName={t("filters:allCategories")} /> */}
                  {/* <FilterCheckBox
                    data={dataFilterSize}
                    filterName={t("filters:size")}
                    />
                    <FilterCheckBox
                    data={dataFilterBrand}
                    filterName={t("filters:brand")}
                  />
                  <FilterCheckBox
                  data={dataFilterColor}
                  filterName={t("filters:color")}
                /> */}
                  <FilterPrice
                    filterName={t("filters:price")}
                    onApply={handleApply}
                    min={String(router.query.min)}
                    max={String(router.query.max)}
                  />
                  {listAttribute?.map((item) => (
                    <FilterCheckBox
                      data={item}
                      filterName={t(`${item._id.name}`)}
                      unCheck={unCheck}
                      onAttributeChange={handleAttributeChange}
                      key={`${item._id.id}+${item._id.name}`}
                    />
                  ))}
                </Filter>
              </div>
            </div>
            <div className="wrap-products flex-1">
              <Products
                showAction={true}
                limit={filter.limit}
                page={filter.page}
                sort={filter.sort}
                onLimitChange={handleLimitPageChange}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                listProducts={listProductsWithStarRating}
                haveFilter
                showFilter={showFilter}
                setShowFilter={handleShowFilter}
                totalRecord={productData ? productData.total : 0}
                favorProductIds={favouriteProductIds?.data}
                buyLaterProductIds={buyLaterProductIds?.data}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ListProducts.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default ListProducts;
