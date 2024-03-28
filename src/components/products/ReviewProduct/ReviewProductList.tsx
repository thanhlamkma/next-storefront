import { Col, Form as AntdForm, Grid, Pagination, Row } from "antd";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { Form } from "src/components";
import CardReviewProduct from "src/components/products/ReviewProduct/CardReviewProduct";
import { optionSort } from "src/data/filter";
import { Product } from "src/data/products";

interface ReviewProductListProps {
  productData?: Array<Product>;
  totalRecord?: number;
  limit?: number;
  page?: number;
  onRating?: (saleOrderLineId?: number) => void;
  onPageChange?: (value: number) => void;
}

const { useBreakpoint } = Grid;

const ReviewProductList = ({
  productData,
  limit,
  page,
  totalRecord,
  onRating,
  onPageChange,
}: ReviewProductListProps) => {
  const [form] = AntdForm.useForm();
  const [typeView, setTypeView] = useState<"normal" | "expand">("normal");
  const { t } = useTranslation();

  const onFinishForm = useCallback((values: any) => {
    form.resetFields();
  }, []);
  const breakpoint = useBreakpoint();
  const isMobile = useMemo(() => {
    return !breakpoint.sm;
  }, [breakpoint]);

  useEffect(() => {
    isMobile && setTypeView("normal");
  }, [isMobile]);

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

  const dataOptionSort = useMemo(() => {
    const options = optionSort.map((x) => ({ ...x, label: t(x.label) }));
    return options;
  }, [optionSort]);

  const renderPagination = useMemo(() => {
    return productData?.length ? (
      <Pagination
        current={page}
        total={totalRecord}
        pageSize={Number(limit)}
        onChange={onPageChange}
      />
    ) : (
      <></>
    );
  }, [productData, totalRecord, limit, page]);

  return (
    <div id="products" className="w-full mb-10">
      <div className="filter-view mb-4">
        <Form
          form={form}
          initialValues={
            {
              // sort: dataOptionSort[0].value,
              // limit: optionViewer[0].value,
            }
          }
          enableReinitialize
          onFinish={onFinishForm}
        >
          <Row
            className="xs:flex-col sm:flex-row sm:align-middle"
            justify="space-between"
          >
            <Col className="flex items-center sorter">
              {/* <span className="font-semibold mr-3">{t("filters:sortBy")}</span>
              <Form.Item name="sort">
                <Select
                  dropdownClassName="dropdown-select-auto"
                  size="middle"
                  options={dataOptionSort}
                />
              </Form.Item> */}
            </Col>
            <Col className="viewer flex items-center gap-4 xs:ml-[62px] 2sm:ml-0">
              {/* <Form.Item name="limit">
                <Select
                  dropdownClassName="dropdown-select-auto"
                  size="middle"
                  options={optionViewer}
                />
              </Form.Item> */}
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
      <div className="">
        <Row align="middle" gutter={[16, 32]}>
          {productData &&
            productData.map((product: Product, index) => (
              <Col
                key={`products-product-${product.id}-${index}`}
                md={typeView === "normal" ? 8 : 24}
                span={typeView === "normal" ? 12 : 24}
              >
                <CardReviewProduct
                  {...product}
                  typeView={getTypeViewCardProduct}
                  onRating={() => onRating && onRating(product.saleOrderLineId)}
                />
              </Col>
            ))}
        </Row>
        <div className="flex justify-center mt-5">{renderPagination}</div>
      </div>
    </div>
  );
};

export default ReviewProductList;
