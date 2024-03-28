import { Col, Form as AntdForm, Grid, Pagination, Row } from "antd";
import { SelectValue } from "antd/lib/select";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import { Form, Select } from "src/components";
import CardProduct from "src/components/products/CardProduct";
import { useJob } from "src/core/hooks";
import {
  LimitValue,
  optionSort,
  optionViewer,
  SortValue,
} from "src/data/filter";
import { Product } from "src/data/products";
import ViewedProductRepository from "src/repositories/ViewedProductRepository";

interface ProductsProps {
  listProducts?: Product[];
  limit?: LimitValue;
  sort?: SortValue;
  page?: number;

  onLimitChange?: (value: SelectValue) => void;
  onSortChange?: (value: SelectValue) => void;
  onPageChange?: (value: number) => void;
  onRemoveFavor?: (value: number) => void;

  totalRecord?: number;
  isFavorite?: boolean;
  isSaveLater?: boolean;
  haveFilter?: boolean;
  showFilter?: boolean;
  showAction?: boolean;
  setShowFilter?: () => void;

  favorProductIds?: number[];
  buyLaterProductIds?: number[];
}

const { useBreakpoint } = Grid;

const Products = ({
  listProducts = [],
  totalRecord,
  limit,
  sort,
  page,
  onLimitChange,
  onSortChange,
  onPageChange,
  onRemoveFavor,
  showAction = false,
  favorProductIds,
  buyLaterProductIds,
  ...props
}: ProductsProps) => {
  const [form] = AntdForm.useForm();
  const session = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [typeView, setTypeView] = useState<"normal" | "expand">("normal");
  const { isFavorite, isSaveLater } = props;

  const breakpoint = useBreakpoint();
  const isMobile = useMemo(() => {
    return !breakpoint.sm;
  }, [breakpoint]);

  // Call API
  const { run: addViewedProductApi } = useJob(
    useCallback((productTemplateId: number) => {
      return ViewedProductRepository.addViewedProduct(productTemplateId).pipe(
        map((res: any) => {
          console.log("add viewed success:", res);
        }),
        catchError((err) => {
          console.log("add viewed err", err);
          return of(err);
        })
      );
    }, [])
  );

  useEffect(() => {
    isMobile && setTypeView("normal");
  }, [isMobile]);

  const onFinishForm = useCallback((values: any) => {
    form.resetFields();
  }, []);

  const dataOptionSort = useMemo(() => {
    const options = optionSort.map((x) => ({ ...x, label: t(x.label) }));
    return options;
  }, [optionSort]);

  const dataOptionViewer = useMemo(() => {
    const options = optionViewer.map((x) => ({
      ...x,
      label: `${t("common:show")} ${x.value}` || x.label,
    }));
    return options;
  }, [optionSort]);

  const getTypeViewCardProduct = useMemo((): "col" | "row" => {
    switch (typeView) {
      case "normal":
        return "col";
      case "expand":
        return "row";
      default:
        return "col";
    }
  }, [typeView]);

  const renderPagination = useMemo(() => {
    return listProducts.length ? (
      <Pagination
        current={Number(router.query.page) || page}
        total={totalRecord}
        pageSize={Number(limit)}
        onChange={onPageChange}
      />
    ) : (
      <></>
    );
  }, [listProducts, totalRecord, limit, page, router.query]);

  // Handle redirect path
  const handleRedirectProduct = useCallback((id: number) => {
    if (session.status === "authenticated") addViewedProductApi(id);
    router.push(router.basePath + `/products/${id}`);
  }, []);

  // Handle remove favourite product
  const handleRemoveFavor = (id: number) => {
    onRemoveFavor && onRemoveFavor(id);
  };

  return (
    <div id="products" className="w-full mb-10">
      <div className="filter-view mb-4">
        <Form
          form={form}
          initialValues={{
            sort: sort,
            limit: limit,
          }}
          enableReinitialize
          onFinish={onFinishForm}
        >
          <Row
            className="sm:flex-row sm:align-middle"
            justify="space-between"
            gutter={[10, 10]}
          >
            <Col className="flex items-center sorter" span={12}>
              {props.haveFilter ? (
                <>
                  <div
                    className="xs:flex mlg:hidden items-center h-[30px] 2sm:w-[150px] sm:w-[50px] hover:bg-hover-color hover:text-white hover:cursor-pointer font-medium text-hover-color 2ms:hidden showFilterBtn px-4 mr-2 rounded-[4px] border-hover"
                    onClick={props.setShowFilter}
                  >
                    <AiOutlineUnorderedList fontSize={16} />
                    <span className="text-[14px] leading-[30px] xs:hidden 2sm:inline 2sm:ml-2">
                      {t("products:filters")}
                    </span>
                  </div>
                  {/* <span className="xs:hidden 2sm:inline font-semibold mr-3">
                    {t("filters:sortBy")}
                  </span> */}
                </>
              ) : (
                ""
              )}
              {onSortChange ? (
                <>
                  <span className="font-semibold mr-3 2sm:hidden xs:hidden md:inline">
                    {t("filters:sortBy")}
                  </span>
                  <Form.Item name="sort">
                    <Select
                      dropdownClassName="dropdown-select-auto"
                      size="middle"
                      onChange={onSortChange}
                      options={dataOptionSort}
                    />
                  </Form.Item>
                </>
              ) : (
                ""
              )}
            </Col>
            <Col
              className="viewer flex items-center justify-end gap-4 xs:ml-[62px] 2sm:ml-0"
              span={6}
            >
              <Form.Item name="limit">
                <Select
                  dropdownClassName="dropdown-select-auto"
                  size="middle"
                  onChange={onLimitChange}
                  options={dataOptionViewer}
                />
              </Form.Item>
              <div className="items-center gap-2 xs:hidden 2sm:flex">
                <span
                  className={classNames(
                    ["text-2xl font-semibold cursor-pointer"],
                    {
                      "text-black-33": typeView === "normal",
                      "text-gray-cc": typeView !== "normal",
                    }
                  )}
                  onClick={() => setTypeView("normal")}
                >
                  <BsGrid3X3GapFill />
                </span>
                <span
                  className={classNames(
                    ["text-2xl font-semibold cursor-pointer"],
                    {
                      "text-black-33": typeView === "expand",
                      "text-gray-cc": typeView !== "expand",
                    }
                  )}
                  onClick={() => setTypeView("expand")}
                >
                  <FaThList />
                </span>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="md:mx-2 mx-1">
        <Row align="middle" gutter={[16, 32]}>
          {listProducts && listProducts.length > 0 ? (
            listProducts.map((product: Product, index) => (
              <Col
                className="relative mt-2"
                key={`products-product-${product.id}-${index}`} // Need to remove index later
                md={typeView === "normal" ? 8 : 24}
                span={typeView === "normal" ? 12 : 24}
              >
                <CardProduct
                  {...product}
                  typeView={getTypeViewCardProduct}
                  isFavorite={isFavorite}
                  isFavorIcon={favorProductIds?.includes(Number(product.id))}
                  isSaveLater={isSaveLater}
                  isSaveLaterIcon={buyLaterProductIds?.includes(
                    Number(product.id)
                  )}
                  showActionBar={showAction}
                  // onClick={() => handleRedirectProduct(Number(product.id))}
                  onRemoveFavor={() => handleRemoveFavor(Number(product.id))}
                />
              </Col>
            ))
          ) : (
            <div className="mt-10 w-full flex flex-col items-center text-gray-400">
              {/* <ExclamationCircleOutlined className="text-[80px] text-gray-400" /> */}
              <Image
                objectFit="cover"
                src={Images.product.noProductFound || Images.errors.errorImage}
                width={200}
                height={200}
                style={{ opacity: 0.25 }}
              />
              <p className="mt-8 text-[14px] font-semibold text-gray-400">
                {t("products:notFound")}
              </p>
            </div>
          )}
        </Row>
      </div>
      <div className="flex justify-center mt-5">{renderPagination}</div>
    </div>
  );
};

export default memo(Products);
